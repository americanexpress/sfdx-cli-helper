/**
 * Main class
 */
export declare class ConfigHelper {
    options: any;
    configPathGetter: () => string;
    configSettingsFileCreator: any;
    configValueSetter: any;
    configKeyValidator: any;
    constructor(options: IConfigHelperOptions);
    private getSettings;
    /**
     * Saves a config value to the file determined by the
     *   configKey settingin config-settings.json
     * @param input JSON object with single property and value
     * @return Path to the configuration file
     */
    setValue(input: object): string;
    static getSettings(): any;
    /**
     * Assigns functions required by setValue
     */
    private setFunctions;
    /**
     * Throws an error if input property name doesn't match the valid keys
     * @param validKeys Array of valid configuration keys
     * @param input JSON object with single property and value
     */
    private validateKey;
}
/**
 * Interface for options passed in the helper's constructor
 */
export interface IConfigHelperOptions {
    validKeys: string[];
}
