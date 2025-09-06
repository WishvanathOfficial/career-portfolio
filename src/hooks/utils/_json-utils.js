/**
 * @author Wishvanath Sah
 * @date 2025-01-01
 */

export const _jsonUtils = {
    /**
     * @param {Object} json
     * @return {string}
     */
    sanitizeForLogs: (json) => {
        const hasFilledField = Object.values(json).some((value) => { return value })

        if(!hasFilledField)
            return ""

        return JSON.stringify(json).replaceAll(`",`, `",<br>`)
            .replaceAll(`":`, `": `)
            .replaceAll(`"`, ``)
            .replaceAll(`{`, ``)
            .replaceAll(`}`, ``)
            .replaceAll(` ,`, ``)
    }
}