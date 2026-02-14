import validator from "validator";

export function isValidUrl(str: string): boolean {
    if (typeof str !== "string" || validator.isEmpty(str, { ignore_whitespace: true })) {
        return false;
    }
    return validator.isURL(str, {
        protocols: ["http", "https"],
        require_protocol: true,
        require_valid_protocol: true,
        require_host: true,
        require_tld: true,
    });
}