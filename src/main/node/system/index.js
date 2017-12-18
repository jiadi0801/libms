exports.ResWrap = function (msg, success, data, statusCode) {
    if (success === undefined) {
        success = true;
    }

    if (success) {
        statusCode = 200;
    } else {
        statusCode = '';
    }

    return {
        success: success,
        msg: msg,
        statusCode: statusCode,
        data: data || {}
    }
}