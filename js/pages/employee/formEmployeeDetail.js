class FormEmployeeDetail {
    constructor(popupName) {
        this.form = $(`#${popupName}`);
        this.inputChange();
    }

    // Validate form
    validateForm() {
        let me = this,
            isValid = me.validateRequire(); // Validate bắt buộc phải nhập

        if (isValid) {
            isValid = me.validateFieldNumber(); // Validate các trường nhập số
        }

        if (isValid) {
            isValid = me.validateDate(); // Validate các trường ngày tháng
        }

        if (isValid) {
            isValid = me.validateCustom(); // Validate các trường đặc biệt khác
        }

        return isValid;
    }

    validateRequire() {
        let me = this,
            isValid = true,
            boxNotification = $(
                '<div class="box-notification">Vui lòng không để trống!</div>'
            );

        // Duyệt hết các trường require
        me.form.find("[Require = 'true']").each(function () {
            let value = $(this).val();

            if (!value) {
                isValid = false;

                $(this).parent().append(boxNotification); // thêm phần tử thông báo vào các ô input chưa nhập dữ liệu
                $(this).parent().addClass("error"); // chưa nhập thì border của ô input sẽ chuyển màu đỏ
                boxNotification.fadeOut(5000); //setup tg ẩn thông báo
            } else {
                me.hiddenBoxNotification($(this));
            }
        });

        return isValid;
    }

    // Thay đổi value của các thẻ input (nếu khi lưu mà chưa nhập, sau đó nhập bổ sung thì sẽ ẩn hộp thông báo)
    inputChange() {
        let me = this;
        $("input").change(function () {
            let value = "";
            if (value === "") {
                value = $(this).val();
                me.hiddenBoxNotification($(this));
            }
        });
    }

    hiddenBoxNotification(selector) {
        $(selector)
            .parent()
            .children(".box-notification")
            .toggleClass("display-none");

        $(selector).parent().removeClass("error");
    }
}
