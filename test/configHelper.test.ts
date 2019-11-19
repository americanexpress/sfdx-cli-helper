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
import * as path from 'path';
import { ConfigHelper } from '../src/configHelper'

/**
 * Constructor tests
 */
describe('constructor tests', () => {
    test('validKeys is empty when not passed in constructor', () => {
        const helper = new ConfigHelper(null);
        expect(helper.options).toBeNull();
    });

    test('constructor options set when passed', () => {
        const helper = new ConfigHelper({ validKeys: ['x'] });
        expect(helper.options.validKeys).toContain('x');
    });
});

/**
 * Tests for setValue method
 */
describe('setValue tests', () => {
    afterAll(() => {
        const rimraf = require('rimraf');
        rimraf.sync('./resources');
    });

    test('sets the required functions on the class', () => {
        const helper = new ConfigHelper(null);
        helper.setValue({'x':'y'});
        expect(helper.configPathGetter).not.toBeUndefined();
        expect(helper.configSettingsFileCreator).not.toBeUndefined();
        expect(helper.configValueSetter).not.toBeUndefined();
    });

    test('returns the config path as ./resources/config-settings.json', () => {
        const helper = new ConfigHelper(null);
        const configPath = helper.setValue({'x':'y'});

        // Assertions
        expect(configPath).toEqual(path.resolve('./resources/plugin-config.json'));
    });

    test('static file creator function called once if config path getter throw exception', () => {
        // Create mocks
        const mockConfigPathGetter = jest.fn(() => {
            throw new Error();
        });
        const mockConfigSettingsFileCreator = jest.fn();

        // Test
        const helper = new ConfigHelper(null);
        helper.configPathGetter = mockConfigPathGetter;
        helper.configSettingsFileCreator = mockConfigSettingsFileCreator;
        helper.setValue({'x':'y'});

        // Assertions
        expect(mockConfigSettingsFileCreator).toBeCalledTimes(1);
    });

    test('config value setter called with correct path and value', () => {
        jest.clearAllMocks();
        // Create mocks
        const mockConfigPathGetter = jest.fn(() => './resources/plugin-config.json');
        const mockConfigSettingsFileCreator = jest.fn();
        const mockConfigValueSetter = jest.fn();

        // Test
        const helper = new ConfigHelper(null);
        helper.configPathGetter = mockConfigPathGetter;
        helper.configSettingsFileCreator = mockConfigSettingsFileCreator;
        helper.configValueSetter = mockConfigValueSetter;
        helper.setValue({x: 'y'});

        // Assertions
        expect(mockConfigValueSetter).toBeCalledTimes(1);
        expect(mockConfigValueSetter).toBeCalledWith('./resources/plugin-config.json', {x: 'y'});
    });

    test('throws error if setting is invalid', () => {
        const helper = new ConfigHelper( {validKeys: ['validKey1', 'validKey2']} );
        let errorMsg = '';
        try {
            helper.setValue({invalidKey: 'value'});
        } catch(exc) {
            errorMsg = exc.message;
        }

        expect(errorMsg).toEqual('Configuration key invalid: invalidKey\nValid keys are: validKey1, validKey2');
    });
});
