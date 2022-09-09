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

        // Lấy form Employee Detail
        this.initFormEmployeeDetail();
    }

    initEvents() {
        this.initEventToolbar();

        // sự kiện thao tác với table
        this.initEventsTable();
    }

    initEventToolbar() {
        let me = this;

        me.gridTable.on("click", "#toolbar", function () {
            let commandType = $(this).attr("CommandType");
            // alert(commandType);
            if (me[commandType] && typeof me[commandType] === "function") {
                me[commandType]();
            }
        });
    }

    add() {
        let me = this,
            param = {
                parent: me,
                formMode: Enumeration.FormMode.Add,
            };
        if (me.employeeIDs.length >= 1) {
            alert(
                "Để thực hiện chức năng thêm mới vui lòng k click trường nào trong bảnh"
            );
            return;
        }
        me.formEmployeeDetail.openForm(param);
    }

    edit() {
        let me = this;

        if (me.employeeIDs.length !== 1) {
            alert("Bạn phải chọn 1 bản ghi để sửa");
            return;
        } else {
            me.getRowData(me.employeeIDs[0]);
        }
    }

    copy() {}

    close() {
        let me = this;
        me.formEmployeeDetail.closeForm();

        // Ẩn thông báo xóa
        $("#popupDelete").hide();
    }

    // xóa bảng ghi thông tin nhân viên được chọn
    delete() {
        let me = this,
            employeeIDs = me.employeeIDs, // Lấy ra các employeeId đã chọn
            employeeCodes = me.employeesCodes, // Lấy ra các employeeCode đã chọn để sử dụng cho thông báo
            url = me.gridTable.attr("Url");

        let listEmployeeRemove = employeeCodes.join(", "); // Nội dung thông báo những nhân viên muốn xóa
        let textContent =
            employeeIDs.length === 0
                ? "Bạn chưa chọn bản ghi nào để xóa. Hãy thao tác lại!!!"
                : `Bạn có chắc chắn muốn xóa nhân viên [${listEmployeeRemove}] không?`;

        let popupDelete = $(
            `<div class="popup popup__modal" id="popupDelete" > <i class="fa-solid fa-xmark icon__popup--xmark flex-horizontal-end btn__cancel" ></i><div class="popup__title">Xóa bản ghi thông tin nhân viên</div> <div class="center-the-element m-24"><i class="fa-solid fa-circle-exclamation icon__popup icon__popup--delete"></i><div class="popup__content">${textContent}</div> </div><div class="popup__buttons flex-horizontal-end">${
                employeeIDs.length === 0
                    ? '<button class="btn btn__effect btn__less3-word btn-popup popup__delet btn__cancel" >OK</button>'
                    : '<button class="btn__effect btn__less3-word btn__popup btn__popup--left btn__cancel" >Hủy</button><button class="btn btn__effect btn__less3-word btn-popup popup__delete btn__delete" >Xóa</button> '
            }</div></div>`
        );

        // Hiện thông báo hỏi muốn xóa k
        me.gridTable.append(popupDelete);

        employeeIDs.filter(function (item) {
            // Gán sự kiện cho nút đồng ý xóa
            me.gridTable.on("click", ".btn__delete", function () {
                // Gọi hàm xóa lần lượt các bảng ghi
                CommonFn.Ajax(
                    `${url}/${item}`,
                    Resource.Method.Delete,
                    null,
                    function (response) {
                        if (response) {
                            //load lại dữ liệu
                            me.getData();
                            window.location.reload();
                        } else {
                            console.log("Có lỗi khi xóa dữ liệu từ server");
                        }
                    }
                );

                // Ẩn thông báo xóa
                $("#popupDelete").remove();
            });
        });

        me.gridTable.on("click", ".btn__cancel", function () {
            // Ẩn thông báo xóa
            $("#popupDelete").remove();
        });
    }

    cancel() {}

    save() {
        let me = this;

        // Gọi hàm lưu dữ liệu từ form thông tin nhân viên
        me.formEmployeeDetail.save();
    }

    reload() {
        let me = this;
        me.gridTable.load(location.href + "  #tableEmployees");
        me.getData();
    }

    // Các sự kiện thao tác trong bảng vd click lựa chọn...
    initEventsTable() {
        let me = this;
        (me.employeeIDs = []), (me.employeesCodes = []);
        /**
         * Khỏi tạo sự kiện khi click vào mỗi dòng, đồng thời checkbox cx đc tích tương ứng
         *  */
        me.gridTable.on("click", ".grid__row", function () {
            // toggleClass (nếu có class đó r thì xóa, k có class đó thì add vào)
            $(this).toggleClass("grid__row--active");

            $(this).children(".checkbox__item").toggleClass("border-gray");
            $(this)
                .children(".checkbox__item")
                .children(".box__checked")
                .toggleClass("display-none");

            //lấy ra employeeId của dòng đang click
            let id = $(this).children(".checkbox__item").attr("id");

            //lấy ra employeeCode của dòng đang click
            let code = $(this).children("[FieldName = 'EmployeeCode']").text();

            if ($(this).hasClass("grid__row--active")) {
                // Lấy ra employeeId theo dòng đang click
                me.employeeIDs.push(id);
                me.employeesCodes.push(code);
            } else {
                me.employeeIDs.filter((employeeId, index) => {
                    // Loại bỏ ra các id đã đc tick xong sau đó k tick nx
                    if (employeeId === id) {
                        me.employeeIDs.splice(index, 1);
                    }
                });

                me.employeesCodes.filter((employeeCode, index) => {
                    // Loại bỏ ra các id đã đc tick xong sau đó k tick nx
                    if (employeeCode === code) {
                        me.employeesCodes.splice(index, 1);
                    }
                });
            }
        });
    }

    /**
     * Init formEmployeeDetail
     */

    initFormEmployeeDetail() {
        let me = this;
        me.formEmployeeDetail = new FormEmployeeDetail("popupInfoEmployee");
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

        // Duyệt từng cột để lấy các thông tin của cột có trong header table
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

        return columns;
    }

    /**
     * Hàm dùng để lấy dữ liệu cho trang
     */
    getData() {
        let me = this,
            url = me.gridTable.attr("Url");

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

                // thêm id vào checkbox để khi click mk sẽ túm đc id tương ứng
                checkbox.attr("id", item.EmployeeId);

                row.append(checkbox);

                // Duyệt từng cột để vẽ body
                me.gridTable.find(".grid__item").each(function () {
                    let fieldName = $(this).attr("FieldName"),
                        dataType = $(this).attr("DataType"),
                        h2 = $("<h2></h2>"),
                        value = me.getValueCell(item, fieldName, dataType),
                        className = me.getClassFormat(dataType);

                    if (fieldName !== "") {
                        h2.attr("FieldName", fieldName);
                        h2.text(value);
                        h2.addClass(className);
                        row.append(h2);
                    }
                });

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
                break;
            case Resource.DataTypeColumn.Date:
                value = CommonFn.formatDate(value);
                break;
            case "Enum":
                break;
        }

        if (fieldName === "WorkStatus") {
            // fix cứng tạm tại trên API của a Mạnh khum thấy có name -.-
            switch (value) {
                case 0:
                    value = "Đang làm việc";
                    break;
                case 1:
                    value = "Đã thôi việc";
                    break;
                case 2:
                    value = "Tạm nghỉ làm";
                    break;
            }
        }

        return value;
    }

    /**
     * Hàm dùng để lấy class format cho từng kiểu dữ liệu
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

    // Lấy ra thông tin của 1 dòng đang click để thực hiện chức năng sửa
    getRowData(id) {
        let me = this,
            url = me.gridTable.attr("Url") + "/" + id;
        CommonFn.Ajax(url, Resource.Method.Get, {}, function (response) {
            if (response) {
                let param = {
                    parent: me,
                    formMode: Enumeration.FormMode.Edit,
                    dataRowClick: response,
                };
                me.formEmployeeDetail.openForm(param);
            } else {
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
        });
    }
}

// Khởi tạo biến employees cho trang quản lý nhân viên
const employees = new Employees("tableEmployees");
