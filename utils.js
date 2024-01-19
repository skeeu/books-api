const validateFields = (data, fieldRules) => {
    for (const [field, rules] of Object.entries(fieldRules)) {
        const value = data[field];

        if (value === undefined) {
            return `${field} is required.`;
        }

        if (rules.min && value.length < rules.min) {
            return `${field} should be at least ${rules.min} characters long.`;
        }

        if (rules.max && value.length > rules.max) {
            return `${field} should be at most ${rules.max} characters long.`;
        }

        if (rules.integer) {
            const intValue = parseInt(value, 10);
            if (isNaN(intValue) || String(intValue) !== value) {
                return `${field} should be an integer.`;
            }
        }

        if (rules.minValue && value < rules.minValue) {
            return `${field} should be greater than or equal to ${rules.minValue}.`;
        }

        if (rules.maxValue && value > rules.maxValue) {
            return `${field} should be less than or equal to ${rules.maxValue}.`;
        }
    }

    return null;
};

module.exports = {
    validateFields
}