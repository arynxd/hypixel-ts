import {AxiosError} from "axios";

export function extractMessage(error: AxiosError, url: string): string {
    let err = `Encountered error on URL ${url}.`;
    err += ` Status code ${error.response?.status}. Message: ${error.response?.data.cause}`

    return err
}