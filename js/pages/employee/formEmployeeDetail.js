class FormEmployeeDetail {
    constructor(popupName) {
        this.form = $(`#${popupName}`);
        this.inputChange();
        this.renderComboBox();
    }

    renderComboBox() {
        let me = this;

        // Trả ra combobox vị trí
        me.getDataCombobox("Positions");

        // Trả ra combobox phòng ban
        me.getDataCombobox("Departments");
    }

    // lấy dữ liệu từ server
    getDataCombobox(name) {
        let me = this,
            url = `https://cukcuk.manhnv.net/api/v1/${name}`;
        CommonFn.Ajax(url, Resource.Method.Get, {}, function (response) {
            if (response) {
                response.map(function (item) {
                    //name.slice(0, -1) : lấy tên bảng trừ đi ký tự cuối cùng
                    let option = $(
                        `<option SetField=${`${name.slice(
                            0,
                            -1
                        )}Name`} value = ${`${name.slice(0, -1)}Id`}>${
                            item[`${name.slice(0, -1)}Name`]
                        }</option>`
                    );

                    option.attr("value", item[`${name.slice(0, -1)}Id`]);
                    me.form.find($(`[id=${name}]`)).append(option);
                });
            } else {
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
        });
    }

    // mở form
    openForm(param) {
        let me = this,
            inputEmployeeCode;
        // me.renderComboBox();

        Object.assign(me, param); // gán thêm object param vào me

        // Mở Form
        me.form.toggleClass("display-none");

        // Lấy thông tin nhân viên thực hiện chức năng sửa từ object me
        const dataRowClick = me.dataRowClick;
        // Hiển thị thông tin nhân viên lên form khi thực hiện chức năng sửa
        if (dataRowClick) {
            let inputs = me.form.find(".input");
            for (const input of inputs) {
                let fieldName = $(input).attr("SetField"),
                    type = $(input).attr("type");

                // Gán giá trị cho các trường input:
                if (dataRowClick[fieldName] !== null) {
                    let value = dataRowClick[fieldName];
                    input.value = value;

                    if (type === "date") {
                        let indexEnd = value.indexOf("T");
                        value = value.slice(0, indexEnd);
                        input.value = value;
                    }
                }

                // Gán giá trị cho các trường select: (chưa đc chọn)
                if (
                    dataRowClick[fieldName] === null &&
                    (fieldName === "PositionId" ||
                        fieldName === "DepartmentId" ||
                        fieldName === "Gender")
                ) {
                    input.value = "";
                }
            }
        }

        // lấy input của mã nhân viên để sau thực hiện khi bật form lên thì nó focus vào input mã nhân viên
        inputEmployeeCode = me.form.find($("[SetField='EmployeeCode']"));

        if (!me.form.hasClass("display-none")) {
            // Nếu form mở lên thì focus vào ô mã nhân viên
            inputEmployeeCode.focus();

            // Gán giá trị Mã nhân viên sinh tự động khi mở form nếu là thêm mới

            // Nếu k có dòng nào đc chọn thì ms thực hiện gán mã nhân viên tự động
            if (me.parent.employeeIDs.length === 0) {
                me.generateEmployeeCode();
            }
        }

        // Nếu ở mode thêm thì reset form
        if (param && param.formMode == Enumeration.FormMode.Add) {
            me.resetForm();
        }
    }

    // Đóng form
    closeForm() {
        let me = this;
        me.form.toggleClass("display-none");
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
            isValid = me.validatePhoneNumber(); // Validate các trường số điện thoại
        }

        if (isValid) {
            isValid = me.validateEmail(); // Validate các trường nhập email
        }

        if (isValid) {
            // isValid = me.validateDate(); // Validate các trường đặc biệt khác
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
            isNumber = me.checkPhoneNumber(value);
            if (!isNumber) {
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

    //Kiểm tra ngày tháng
    validateDate() {}

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

            if (field === "PositionId") {
                //Lấy ID của vị trí
                value = $("#Positions option:selected").val();

                if (value !== 0) {
                    let positionName = $("#Positions option:selected").text();
                    data["PositionName"] = positionName;
                }
            } else if (field === "DepartmentId") {
                // Lấy ID của phòng ban
                value = $("#Departments option:selected").val();

                if (value !== 0) {
                    let departmentName = $(
                        "#Departments option:selected"
                    ).text();
                    data["DepartmentName"] = departmentName;
                }
            }

            data[field] = value;
            if (me.dataRowClick) {
                data.EmployeeId = me.dataRowClick.EmployeeId;
            }
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
        // console.table(data);

        let me = this,
            method = Resource.Method.Post,
            url = me.form.attr("Url");

        // Xử lý lưu vào DB
        if (me.formMode === Enumeration.FormMode.Edit) {
            method = Resource.Method.Put;
            url = url + "/" + me.dataRowClick.EmployeeId;
        }

        CommonFn.Ajax(url, method, data, function (response) {
            if (response) {
                me.parent.employeeIDs = [];
                me.parent.getData();
                window.location.reload();
                // $("#tableEmployees").load(location.href + "  #tableEmployees");

                me.closeForm();
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
            // cach 1
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

    // Tự sinh mã nhân viên theo cú pháp "NV" + mã số nhân viên lớn nhất trong hệ thống + 1
    generateEmployeeCode() {
        let me = this;
        let url = me.form.attr("Url");
        CommonFn.Ajax(url, Resource.Method.Get, null, function (response) {
            if (response) {
                let employeeCodes = response
                    .map(
                        (item) => +item.EmployeeCode.replace(/NV/g, "") // thay thế tất cả các chữ "NV" trong chuỗi bằng "" đồng thời trả về kiểu dữ liệu number
                    )
                    .sort((a, b) => b - a); // sắp xếp mảng theo thứ tự giảm dần

                let employeeCode = "NV" + (employeeCodes[0] + 1); // tự sinh mã nhân viên theo cú pháp "NV" + mã số nhân viên lớn nhất trong hệ thống + 1
                me.form.find("[SetField='EmployeeCode']").val(employeeCode);
            } else {
                console.log("Có lỗi");
            }
        });
    }
}
