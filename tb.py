from PyQt5.QtWidgets import QApplication, QTableView, QWidget, QVBoxLayout, QMainWindow, QLineEdit, QComboBox, QLabel, QGridLayout, QMenu, QAbstractItemView, QToolTip, QTableWidget
from PyQt5 import QtCore, QtGui
import pandas as pd
import numpy as np
import yaml
import sys

class Table(QtCore.QAbstractTableModel):
    def __init__(self, parent, *args):
        super(Table, self).__init__(parent)
        self.data = None
        # determines order of columns
        self.header = ['question', 'parts', 'answer', 'tags', ]

    def update(self, data):
        self.data = data

    def rowCount(self, parent=QtCore.QModelIndex()):
        return self.data.shape[0]

    def columnCount(self, parent=QtCore.QModelIndex()):
        return self.data.shape[1]

    def data(self, index, role=QtCore.Qt.DisplayRole):
        if role == QtCore.Qt.DisplayRole:
            i = index.row()
            j = index.column()
            cols = self.data.columns
            datum = self.data.iat[i, j]
            if cols[j] == 'tags':
                return ', '.join(datum)
            return '{0}'.format(datum)
        else:
            return QtCore.QVariant()

    def headerData(self, section, orientation, role=QtCore.Qt.DisplayRole):
        if role == QtCore.Qt.DisplayRole and orientation == QtCore.Qt.Horizontal:
            return self.header[section]
        return QtCore.QAbstractTableModel.headerData(self, section, orientation, role)

    def flags(self, index):
        return QtCore.Qt.ItemIsEnabled


class tbFrame(QMainWindow):
    def __init__(self, f, parent=None):
        super(tbFrame, self).__init__(parent)
        self.centralwidget = QWidget(self)
        self.lineEdit = QLineEdit(self.centralwidget)
        self.view = QTableView(self.centralwidget)
        self.comboBox = QComboBox(self.centralwidget)
        self.label = QLabel(self.centralwidget)
        self.f = f

        self.gridLayout = QGridLayout(self.centralwidget)
        self.gridLayout.addWidget(self.lineEdit, 0, 1, 1, 1)
        self.gridLayout.addWidget(self.view, 1, 0, 1, 3)
        self.gridLayout.addWidget(self.comboBox, 0, 2, 1, 1)
        self.gridLayout.addWidget(self.label, 0, 0, 1, 1)

        self.setCentralWidget(self.centralwidget)
        self.label.setText("Regex Filter")

        self.model = Table(self)
        self.model.update(self.get_df()) # retreive data

        self.proxy = QtCore.QSortFilterProxyModel(self)
        self.proxy.setSourceModel(self.model) # fill data
        self.view.setModel(self.proxy)

        # select rows?
        self.view.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.view.SelectionMode(QAbstractItemView.ExtendedSelection)

        self.view.setSortingEnabled(True) # sortable cols
        self.view.horizontalHeader().setSectionsMovable(True) # moveable cols

        # fill window
        self.view.horizontalHeader().setStretchLastSection(True)

        self.comboBox.addItems(self.model.header)
        self.lineEdit.textChanged.connect(self.on_lineEdit_textChanged)
        self.comboBox.currentIndexChanged.connect(self.on_comboBox_currentIndexChanged)
        self.horizontalHeader = self.view.horizontalHeader()


    @QtCore.pyqtSlot()
    def on_actionAll_triggered(self):
        filterColumn = self.logicalIndex
        filterString = QtCore.QRegExp("",
                                      QtCore.Qt.CaseInsensitive,
                                      QtCore.QRegExp.RegExp)

        self.proxy.setFilterRegExp(filterString)
        self.proxy.setFilterKeyColumn(filterColumn)

    @QtCore.pyqtSlot(int)
    def on_signalMapper_mapped(self, i):
        stringAction = self.signalMapper.mapping(i).text()
        filterColumn = self.logicalIndex
        filterString = QtCore.QRegExp(stringAction,
                                      QtCore.Qt.CaseSensitive,
                                      QtCore.QRegExp.FixedString)

        self.proxy.setFilterRegExp(filterString)
        self.proxy.setFilterKeyColumn(filterColumn)

    @QtCore.pyqtSlot(str)
    def on_lineEdit_textChanged(self, text):
        search = QtCore.QRegExp(text,
                                QtCore.Qt.CaseInsensitive,
                                QtCore.QRegExp.RegExp)

        self.proxy.setFilterRegExp(search)

    @QtCore.pyqtSlot(int)
    def on_comboBox_currentIndexChanged(self, index):
        self.proxy.setFilterKeyColumn(index)

    def get_df(self):
        y = yaml.load(open(self.f, 'r'))
        df = pd.io.json.json_normalize(y)
        df = df.replace(np.nan, ' ', regex=True)
        return df[self.model.header]


def main():
    app = QApplication(sys.argv)
    w = tbFrame(str(app.arguments()[1]))
    w.resize(500, 300)
    w.show()
    w.raise_()
    sys.exit(app.exec_())
