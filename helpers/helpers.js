
const success = (res, message, data) => {
    response = {
        status: true,
        message: message,


    }
    if (data && data.totalRecordCount != 0) {

        response.currentPage = data.currentPage ?? 0;
        response.totalPages = data.totalPages ?? 0;
        response.totalRecordCount = data.totalRecordCount ?? 0;
        response.data = data != null ? data.data : null;
    }
    res.send(response);
};
const norecordfound = (res, message, data) => {

    res.send({
        status: false,
        message: message,

        currentPage: data ? data.currentPage : 0,
        totalPages: data ? data.totalPages : 0,
        totalRecordCount: data ? data.totalRecordCount : 0, data: data
    });
};

const error = (res, error) => {
    let errorMessage;

    if (error.code === 11000) {
        errorMessage = "Duplicate error: The email already exists.";
    } else if (error.name === 'ValidationError') {
        errorMessage = "Validation error: " + error.message;
    } else if (error.name === 'CastError') {
        errorMessage = "Invalid data format: " + error.message;
    } else {
        errorMessage = error.message || "Some error occurred while processing the request";
    }

    res.status(500).send({
        status: false,
        message: errorMessage,
        currentPage: 0,
        totalPages: 0,
        totalRecordCount: 0
    });
}