"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const util_1 = require("util");
/**
 * Main class
 */
class ConfigHelper {
    constructor(options) {
        this.options = options;
    }
    getSettings() {
        this.setFunctions();
        let configPath = '';
        try {
            configPath = this.configPathGetter();
        }
        catch (exc) {
            // Create the config settings file
            this.configSettingsFileCreator();
            try {
                configPath = this.configPathGetter();
            }
            catch (_a) {
                const errorMsg = 'Created the config-settings.json file in ./resources.'
                    + ' This file should be checked in.\n'
                    + 'Try running the command again.';
            }
        }
        let settingsJson = {};
        try {
            const settings = fs.readFileSync(configPath);
            settingsJson = JSON.parse(settings.toString());
        }
        catch (exc) {
            console.error(exc.message);
        }
        return settingsJson;
    }
    /**
     * Saves a config value to the file determined by the
     *   configKey settingin config-settings.json
     * @param input JSON object with single property and value
     * @return Path to the configuration file
     */
    setValue(input) {
        this.setFunctions();
        // Validate
        if (this.options && this.options.validKeys) {
            this.validateKey(this.options.validKeys, input);
        }
        let configPath = '';
        try {
            configPath = this.configPathGetter();
        }
        catch (exc) {
            // Create the config settings file
            this.configSettingsFileCreator();
            try {
                configPath = this.configPathGetter();
            }
            catch (_a) {
                const errorMsg = 'Created the config-settings.json file in ./resources.'
                    + ' This file should be checked in.\n'
                    + 'Try running the command again.';
            }
        }
        if (configPath !== '') {
            this.configValueSetter(configPath, input);
        }
        return configPath;
    }
    static getSettings() {
        const helper = new ConfigHelper(null);
        return helper.getSettings();
    }
    /**
     * Assigns functions required by setValue
     */
    setFunctions() {
        if (this.configPathGetter === undefined) {
            this.configPathGetter = getConfigPath;
        }
        if (this.configSettingsFileCreator === undefined) {
            this.configSettingsFileCreator = createConfigSettingsFile;
        }
        if (this.configValueSetter === undefined) {
            this.configValueSetter = setConfigValue;
        }
    }
    /**
     * Throws an error if input property name doesn't match the valid keys
     * @param validKeys Array of valid configuration keys
     * @param input JSON object with single property and value
     */
    validateKey(validKeys, input) {
        if (!util_1.isNullOrUndefined(validKeys)) {
            const inputKey = Object.keys(input)[0];
            const result = validKeys.findIndex(key => key === inputKey);
            if (result === -1) {
                const delimValidKeys = validKeys.join(', ');
                throw new Error(`Configuration key invalid: ${inputKey}\nValid keys are: ${delimValidKeys}`);
            }
        }
    }
}
exports.ConfigHelper = ConfigHelper;
/**
 * Retrieves the configured configuration file location
 */
function getConfigPath() {
    const configSettingsPath = getConfigSettingsPath();
    const settings = fs.readFileSync(configSettingsPath);
    const settingsJSON = JSON.parse(settings.toString());
    const configPath = settingsJSON.configPath;
    const configSettingsDir = path.dirname(configSettingsPath);
    const absRootDir = path.resolve(configSettingsDir + '/..');
    const absConfigPath = path.normalize(absRootDir + '/' + configPath);
    return absConfigPath;
}
/**
 * Gets the path to config-settings.json, depending on locatioon
 */
function getConfigSettingsPath() {
    let dirnamePath = '';
    if (__dirname.indexOf('node_modules') > -1) {
        dirnamePath = `${__dirname}/../../../resources/config-settings.json`;
    }
    else {
        dirnamePath = `${__dirname}/../resources/config-settings.json`;
    }
    return path.resolve(dirnamePath);
}
/**
 * Creates the default config-settings.json file.
 * This path to the plugin-config.json settings file
 *   is defined here in the configPath setting.
 */
function createConfigSettingsFile() {
    const defaultSetting = {
        configPath: './resources/plugin-config.json'
    };
    const configSettingsPath = getConfigSettingsPath();
    writeJsonFileIfNotExists(configSettingsPath, defaultSetting);
}
/**
 * Serializes a JSON object to a file which is created if it does not exist
 * @param filePath Path to the file to be written to
 * @param jsonObj JSON object to serialize
 */
function writeJsonFileIfNotExists(filePath, jsonObj) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(jsonObj, null, '  '));
    }
}
/**
 * Creates the config settings file if it doesn't exist and sets the passed in value
 * @param configPath Path to the config settings file, e.g. ./resources/plugin-config.json
 * @param configValue JSON object with single property and value
 */
function setConfigValue(configPath, configValue) {
    writeJsonFileIfNotExists(configPath, {});
    const settings = fs.readFileSync(configPath);
    const currentSettings = JSON.parse(settings.toString());
    const newSetting = configValue;
    const merged = Object.assign(Object.assign({}, currentSettings), newSetting);
    fs.writeFileSync(configPath, JSON.stringify(merged, null, '   '));
}
//# sourceMappingURL=configHelper.js.map