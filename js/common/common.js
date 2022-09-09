// Các hàm dùng chung toàn chương trình
var CommonFn = CommonFn || {};

// Hàm format số tiền
CommonFn.formatMoney = (money) => {
    if (money && !isNaN(money)) {
        return money.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
        });
    } else {
        return money;
    }
};

// Format ngày tháng
CommonFn.formatDate = (dateSrc) => {
    let date = new Date(dateSrc),
        year = date.getFullYear().toString(),
        month = (date.getMonth() + 1).toString().padStart(2, "0"),
        day = date.getDate().toString().padStart(2, "0");

    return `${day}/${month}/${year}`;
};

// Hàm ajax gọi lên server lấy dữ liệu
CommonFn.Ajax = (url, method, data, fnCallBack, async = true) => {
    $.ajax({
        url: url,
        method: method,
        async: async,
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            fnCallBack(response);
        },
        error: function (errormessage) {
            console.log(errormessage.responseText);
        },
    });
};
