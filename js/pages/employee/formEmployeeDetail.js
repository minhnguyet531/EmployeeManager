class FormEmployeeDetail {
    constructor(popupName) {
        this.form = $(`#${popupName}`);
        this.inputChange();
    }

    openForm(param) {
        let me = this;

        Object.assign(me, param); // gán thêm object param vào me

        // Mở Form
        this.form.toggleClass("display-none");

        // Nếu ở mode thêm thì reset form
        if (param && param.formMode == Enumeration.FormMode.Add) {
            me.resetForm();
        }
    }

    // Thay đổi value của các thẻ input (nếu khi lưu mà chưa nhập, sau đó nhập bổ sung thì sẽ ẩn hộp thông báo)
    inputChange() {
        let me = this;
        $("input").change(function () {
            let value = $(this).val();

            if (!value) {
                me.hiddenBoxNotification($(this));
            }
        });
    }

    // Validate form
    validateForm() {
        let me = this,
            isValid = me.validateRequire(); // Validate bắt buộc phải nhập

        if (isValid) {
            isValid = me.validateFieldCitizenIdentityCard(); // Validate căn cước công dân
        }

        if (isValid) {
            // isValid = me.validatePhoneNumber(); // Validate các trường số điện thoại
        }

        if (isValid) {
            isValid = me.validateEmail(); // Validate các trường nhập email
        }

        if (isValid) {
            // isValid = me.validateCustom(); // Validate các trường đặc biệt khác
        }

        return isValid;
    }

    validateRequire() {
        let me = this,
            isValid = true;

        // Duyệt hết các trường require
        me.form.find("[Require = 'true']").each(function () {
            let value = $(this).val();
            if (!value) {
                isValid = false;
                me.showBoxNotification($(this), "box-notification");
            } else {
                me.hiddenBoxNotification($(this));
            }
        });

        return isValid;
    }

    validateFieldCitizenIdentityCard() {
        let me = this,
            isValid = true,
            citizenIdentityCard,
            isNumber;

        me.form.find("[name='CitizenIdentityCard']").each(function () {
            citizenIdentityCard = $(this).val();
            isNumber = me.checkNumber(citizenIdentityCard);
            if (!isNumber || citizenIdentityCard.length !== 12) {
                isValid = false;
                me.showBoxNotification(
                    $(this),
                    "box-notification-citizen-identity-card"
                );
                return isValid;
            } else {
                me.hiddenBoxNotification($(this));
            }
        });
        return isValid;
    }

    // Validate email
    validateEmail() {
        let me = this,
            email,
            isEmail,
            isValid = true;

        $("input[type=email]").each(function () {
            email = $(this).val();
            isEmail = me.checkEmail(email);
            if (!isEmail) {
                isValid = false;
                me.showBoxNotification($(this), "box-notification-email");
                return isValid;
            } else {
                me.hiddenBoxNotification($(this));
            }
        });

        return isValid;
    }

    // Kiểm tra xem email có đúng định dạng k
    checkEmail = (email) =>
        email.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

    // Validate số
    validatePhoneNumber() {
        let me = this,
            isValid = true,
            isNumber;

        me.form.find("[Validate='phoneNumber']").each(function () {
            let value = $(this).val();
            isNumber = me.checkNumber(value);
            if (!isNumber || !me.checkPhoneNumber(value)) {
                isValid = false;
                me.showBoxNotification($(this), "box-notification-phone");
                return isValid;
            } else {
                me.hiddenBoxNotification($(this));
            }
        });
        return isValid;
    }

    // Kiểm tra số có phải là số không
    checkNumber = (number) => number.match(/^[0-9]+$/);

    // check phonenumber có đúng định dạng không
    checkPhoneNumber = (phoneNumber) =>
        phoneNumber.match(
            /^((\+84|84|0|)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0|1|2|3|4|5|6|7|8|9])([0-9]{7}))$/
        );

    // Hiển thị box thông báo của input
    showBoxNotification(selector, typeNotification) {
        let boxNotification = $('<div class="box-notification"></div>');

        switch (typeNotification) {
            case "box-notification":
                boxNotification.text("Vui lòng không để trống!");
                break;
            case "box-notification-email":
                boxNotification.text("Email không đúng định dạng!");
                break;
            case "box-notification-phone":
                boxNotification.text("Số không đúng định dạng!");
                break;
            case "box-notification-citizen-identity-card":
                boxNotification.text("Sai số căn cước công dân!");
        }

        $(selector).parent().append(boxNotification); // thêm phần tử thông báo vào các ô input chưa nhập dữ liệu
        $(selector).parent().addClass("error"); // chưa nhập thì border của ô input sẽ chuyển màu đỏ
        boxNotification.fadeOut(5000); //setup tg ẩn thông báo
    }

    // Ẩn box thông báo của input
    hiddenBoxNotification(selector) {
        $(selector)
            .parent()
            .children(".box-notification")
            .toggleClass("display-none");

        $(selector).parent().removeClass("error");
    }

    // Get value from form
    getValueForm() {
        let me = this,
            data = {};
        me.form.find("[SetField]").each(function () {
            let dataType = $(this).attr("DataType") || "String",
                field = $(this).attr("SetField"),
                value = null;

            switch (dataType) {
                case Resource.DataTypeColumn.String:
                    value = $(this).val();
                    break;
                case Resource.DataTypeColumn.Number:
                    if ($(this).val()) {
                        value = $(this).val();
                    }
                    break;
                case Resource.DataTypeColumn.Date:
                    if ($(this).val()) {
                        value = $(this).val();
                    }
            }

            data[field] = value;
        });

        return data;
    }

    // Lưu thông tin đc điền từ form
    save() {
        let me = this,
            validateForm;
        validateForm = me.validateForm();
        // todo save to database...
        if (validateForm) {
            // Lấy data từ form để tiến hành lưu
            let data = me.getValueForm();

            me.saveData(data);

            // Hiển thị thông báo lưu thành công
            $(".toast-successful").removeClass("display-none");
            $(".toast-successful").fadeOut(7000);

            //Hiển thị thông báo lưu thất bại
            // $(".toast-error").removeClass("display-none");
            // $(".toast-error").fadeOut(7000);
        }
    }

    saveData(data) {
        let me = this,
            method = Resource.Method.Post,
            url = me.form.attr("Url");
        // Xử lý lưu vào DB
        if (me.formMode === Enumeration.FormMode.Edit) {
            method = Resource.Method.Put;
        }

        CommonFn.Ajax(url, method, data, function (response) {
            if (response) {
                me.parent.getData();

                me.resetForm();
            } else {
                console.log("Có lỗi");
            }
        });
    }

    // reset form
    resetForm() {
        let me = this;
        me.form.find("[SetField]").each(function () {
            //cach 1
            // let dataType = $(this).attr("DataType") || "String",
            //     functionName = "reset" + dataType;

            // if (me[functionName] && typeof me[functionName] === "function") {
            //     me[functionName](this);
            // }

            // cach 2
            $(this).val("");
        });
    }

    //cach 1
    // resetNumber(control) {
    //     $(control).val("");
    // }

    // resetString(control) {
    //     $(control).val("");
    // }
}
