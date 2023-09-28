import axios from 'axios'

const APICaller = async (request) => {
    const { url } = request
    const { type } = request
    const { payload } = request

    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        }
    }

    switch (type) {
        case 'get': {
            try {
                let response = await axios.get(url, config)
                let data = await response.data
                return data
            } catch (error) {
                let errorObject = {}
                let errorResponse = await error

                if (errorResponse.hasOwnProperty('message') && errorResponse.message == 'Network Error') {
                    Object.assign(errorObject, { code: 500, message: 'Request failed, server error' })
                } else {
                    if (errorResponse.response.status) {
                        if (errorResponse.response.status == 500) {
                            Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, server error' })
                        } else if (error.response.status == 400) {
                            Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, bad data.' })
                        } else if (error.response.status == 404) {
                            Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, method not found.' })
                        }
                    }
                }

                //can also return error
                return errorObject
            }
        }
        case 'post': {
            try {
                let response = await axios.post(url, payload, config);

                if(response.data) {
                    let data = await response.data
                    return data
                } else {
                    return { status: response.status }
                }
            } catch (error) {
                let errorObject = {}
                let errorResponse = await error

                if (errorResponse.hasOwnProperty('message') && errorResponse.message == 'Network Error') {
                    Object.assign(errorObject, { code: 500, message: 'Request failed, server error' })
                } else {
                    if (errorResponse.response.status) {
                        if (errorResponse.response.status == 500) {
                            Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, server error' })
                        } else if (error.response.status == 400) {
                            if(error.response.data.errors) {
                                let errorMessages = error.response.data.errors
                                let messages = ''

                                errorMessages.map((item) => {
                                    messages += item.description + ' '
                                })

                                Object.assign(errorObject, { code: errorResponse.response.status, message: messages })
                            } else {
                                Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, bad data.' })
                            }
                        } else if (error.response.status == 404) {
                            Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, method not found.' })
                        } else if (error.response.status == 401) {
                            Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, wrong credentials.' })
                        }
                    }
                }

                //can also return error
                return errorObject
            }
        }
        case 'update': {
            try {
                let response = await axios.patch(url, payload, config);
                let data = await response.data
                return data
            } catch (error) {
                let errorObject = {}
                let errorResponse = await error

                if (errorResponse.hasOwnProperty('message') && errorResponse.message == 'Network Error') {
                    Object.assign(errorObject, { code: 500, message: 'Request failed, server error' })
                } else {
                    if (errorResponse.response.status) {
                        if (errorResponse.response.status == 500) {
                            Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, server error' })
                        } else if (error.response.status == 400) {
                            Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, bad data.' })
                        } else if (error.response.status == 404) {
                            Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, method not found.' })
                        }
                    }
                }

                //can also return error
                return errorObject
            }
        }
        case 'delete': {
            try {
                let response = await axios.delete(url, payload, config);
                let data = await response.data
                return data
            } catch (error) {
                let errorObject = {}
                let errorResponse = await error

                if (errorResponse.hasOwnProperty('message') && errorResponse.message == 'Network Error') {
                    Object.assign(errorObject, { code: 500, message: 'Request failed, server error' })
                } else {
                    if (errorResponse.response.status) {
                        if (errorResponse.response.status == 500) {
                            Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, server error' })
                        } else if (error.response.status == 400) {
                            Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, bad data.' })
                        } else if (error.response.status == 404) {
                            Object.assign(errorObject, { code: errorResponse.response.status, message: 'Request failed, method not found.' })
                        }
                    }
                }

                //can also return error
                return errorObject
            }
        }
    }
};

export default APICaller