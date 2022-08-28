class Employees {
    // Hàm khởi tạo
    constructor(tableName) {
        this.gridTable = $(`#${tableName}`);
        // Khởi tạo sự kiện
        this.initEvents();
    }

    initEvents() {
        this.initEventToolbar();
        this.initEventsTable();
    }

    initEventToolbar() {
        let me = this;

        me.gridTable.on("click", ".toolbar", function () {
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
}

// Khởi tạo biến employees cho trang quản lý nhân viên
const employees = new Employees("tableEmployees");
