class Employees {
    // Hàm khởi tạo
    constructor(tableName) {
        this.gridTable = $(`#${tableName}`);
        // Khởi tạo sự kiện
        this.initEvents();

        // Lấy ra cấu hình các cột
        this.columnConfig = this.getColumnConfig();

        // Lấy dữ liệu
        this.getData();
    }

    initEvents() {
        this.initEventToolbar();
        this.initEventsTable();
    }

    initEventToolbar() {
        let me = this;

        me.gridTable.on("click", "#toolbar", function () {
            let commandType = $(this).attr("CommandType");
            console.log(commandType);

            if (me[commandType] && typeof me[commandType] === "function") {
                me[commandType]();
            }
        });
    }

    add() {
        $("#popupInfoEmployee").toggleClass("display-none");
    }

    close() {
        $("#popupInfoEmployee").toggleClass("display-none");
    }

    delete() {}

    cancel() {}

    save() {}

    copy() {}

    initEventsTable() {
        /**
         * Khỏi tạo sự kiện khi click vào mỗi dòng, đồng thời checkbox cx đc tích tương ứng
         *  */
        this.gridTable.on("click", ".grid__row", function () {
            // toggleClass (nếu có class đó r thì xóa, k có class đó thì add vào)
            $(this).toggleClass("grid__row--active");

            $(this).children(".checkbox__item").toggleClass("border-gray");
            $(this)
                .children(".checkbox__item")
                .children(".box__checked")
                .toggleClass("display-none");
        });
    }

    /**
     * Lấy config các cột
     */

    getColumnConfig() {
        let me = this,
            columnDefault = {
                FieldName: "",
                DataType: "String",
                EnumName: "",
                Text: "",
            },
            columns = [];

        // Duyệt từng cột để vẽ header
        me.gridTable.find(".grid__item").each(function () {
            let column = { ...columnDefault },
                that = $(this);

            Object.keys(columnDefault).filter(function (proName) {
                let value = that.attr(proName);

                if (value) {
                    column[proName] = value;
                }

                column.Text = that.text();
            });

            columns.push(column);
        });

        console.log(columns);

        return columns;
    }

    /**
     * Hàm dùng để lấy dữ liệu cho trang
     * NTXUAN (01.07.2022)
     */
    getData() {
        let me = this,
            url = me.gridTable.attr("Url");

        console.log(url);

        CommonFn.Ajax(url, Resource.Method.Get, {}, function (response) {
            if (response) {
                me.loadData(response);
            } else {
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
        });
    }

    /**
     * Load dữ liệu
     */
    loadData(data) {
        let me = this;

        if (data) {
            // Render dữ liệu cho grid
            me.renderTable(data);
        }
    }

    /**
     * Render dữ liệu cho grid
     */
    renderTable(data) {
        let me = this,
            table = $('<div class="table style__layout--table"></div>'),
            tableHeader = me.renderHeader(),
            tableBody = me.renderBody(data);

        table.append(tableHeader);
        table.append(tableBody);

        me.gridTable.find(".table").remove();
        me.gridTable.append(table);
    }

    renderHeader() {
        let me = this,
            headerTable = $(
                '<div class="header-table grid grid__style--table text-bold"></div>'
            );

        me.columnConfig.filter(function (column) {
            let text = column.Text,
                dataType = column.DataType,
                className = me.getClassFormat(dataType),
                h2 = $("<h2></h2>");

            h2.text(text);
            h2.addClass(className);
            headerTable.append(h2);
        });

        return headerTable;
    }

    renderBody(data) {
        let me = this,
            bodyTable = $('<div class="body__table"></div>');

        if (data) {
            data.filter(function (item) {
                let row = $(
                    '<div class="grid grid__style--table grid__row flex-horizontal-alignment"></div>'
                );

                let checkbox = $(
                    '<div class="checkbox__item border-gray"><div class="display-none box__checked"><i class="fa-solid fa-check center-the-element checked"></i></div></div>'
                );

                row.append(checkbox);

                // Duyệt từng cột để vẽ header
                me.gridTable.find(".grid__item").each(function () {
                    let fieldName = $(this).attr("FieldName"),
                        dataType = $(this).attr("DataType"),
                        h2 = $("<h2></h2>"),
                        value = me.getValueCell(item, fieldName, dataType),
                        className = me.getClassFormat(dataType);

                    console.log(value);

                    if (fieldName !== "") {
                        if (fieldName === "Gender") {
                            if (value === 0) value = "Khác";
                            if (value === 1) value = "Nam";
                            if (value === 2) value = "Nữ";
                        }

                        if (fieldName === "WorkStatus") {
                            if (value === 0) value = "Còn làm việc";
                            if (value === 1) value = "Đã nghỉ việc";
                            if (value === 2) value = "Tạm nghỉ";
                        }

                        h2.text(value);
                        h2.addClass(className);
                        row.append(h2);
                    }
                });

                // row.data("Xuan", item);

                bodyTable.append(row);
            });
        }

        return bodyTable;
    }

    /**
     * Lấy giá trị ô
     * @param {} item
     * @param {*} fieldName
     * @param {*} dataType
     */
    getValueCell(item, fieldName, dataType) {
        let me = this,
            value = item[fieldName];

        switch (dataType) {
            case Resource.DataTypeColumn.Number:
                value = CommonFn.formatMoney(value);
                console.log(value);

                break;
            case "Date":
                break;
            case "Enum":
                break;
        }

        return value;
    }

    /**
     * Hàm dùng để lấy class format cho từng kiểu dữ liệu
     * CreatedBy: NTXUAN 06.05.2021
     */
    getClassFormat(dataType) {
        let className = "grid__item";

        switch (dataType) {
            case Resource.DataTypeColumn.Number:
                className += " text-end";
                break;
            case Resource.DataTypeColumn.Date:
                className += " align-center";
                break;
        }

        return className;
    }
}

// Khởi tạo biến employees cho trang quản lý nhân viên
const employees = new Employees("tableEmployees");
