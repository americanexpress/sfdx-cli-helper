# SFDX CLI Helper

The SFDX CLI Helper package provides SFDX plugin developers with utilities to help re-use commands across multiple plugins. The first of these is the ConfigHelper class for adding config:set and config:show commands to your plugins.

## Installation
```
$ npm install --save sfdx-cli-helper
```

## Implementation

### configHelper.js

#### Example 1. Adding a config:set command
You can use this module to uniformly add a **yournamespace:config:set** command to all of your plugins. The sample below includes validation of configuration keys.  
Note: Command help code omitted for simplicity.
```typescript
import { SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
import { ConfigHelper } from 'sfdx-cli-helper'; // Import the ConfigHelper class

export default class Set extends SfdxCommand {

    // Enable key-value pair as an argument
    public static varargs = {
        required: true
    };

    public async run(): Promise<AnyJson> {
        /**
         * Instantiate helper class, passing valid config keys to the constructor.
         * Attempts to set a key-value pair not in this list will display an error.
         */
        const helper = new ConfigHelper({validKeys: [
            'configKey1',
            'configKey2',
            'etc',
        ]});

        // Pass the key-value pair argument to set the config value
        try {
            helper.setValue(this.varargs);
            console.log('Value(s) set successfully');
        } catch (exc) {
            console.error(exc.message);
        }
        return;
    }
}
```

Once you've placed the above code in **src/commands/yournamespace/config/set.ts**, you can set one or more config values as below.
```bash
# one value
$ sfdx yournamespace:config:set configKey1=value

# multiple values separated by pipe (|)
$ sfdx yournamespace:config:set configKey1=value1|configKey2=value2
```

#### Example 2. Adding a yournamespace:config:show command
You can use this module to uniformly add a **yournamespace:config:show** command to all of your plugins.  
Note: Command help code omitted for simplicity.
```typescript
import { SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
import { ConfigHelper } from 'sfdx-cli-helper';

export default class Show extends SfdxCommand {

    public async run(): Promise<AnyJson> {
        const settings = ConfigHelper.getSettings();
        console.log(settings);
        return;
    }
}
```
Once you've placed the above code in **src/commands/yournamespace/config/show.ts**, you can view your configuration settings with the following command.
```bash
$ sfdx yournamespace:config:show
```

#### Configuration File Setup
On the first run of your config:set command, the following two files will be created under **resources**.
The files below store the location of your settings and the settings themselves respectively.
```bash
.
+-- resources
|   +-- config-settings.json # contains location of config file (plugin-config.json)
|   +-- plugin-config.json   # contains config keys and values in json format
```

#### Defaulting Command Arguments to Config Values
For any command where you want flags to automatically default to configured values, implement code similar to the following two examples:

1. Load the settings file configured in the helper
    ```typescript
    import { flags, SfdxCommand } from '@salesforce/command';
    import { Messages } from '@salesforce/core';
    import { AnyJson } from '@salesforce/ts-types';

    // Load configuration settings
    const settings = ConfigHelper.getSettings();
    ```

2. Set default values from the keys in your config file as in the following example:
    ```typescript
    protected static flagsConfig = {
        apikey: flags.string({ char: 'k', default: settings.apiKey, description: 'the api key', required: true }), // configurable
        // other flags ...
    };
    ```

## Contributing

We welcome Your interest in the American Express Open Source Community on Github.
Any Contributor to any Open Source Project managed by the American Express Open
Source Community must accept and sign an Agreement indicating agreement to the
terms below. Except for the rights granted in this Agreement to American Express
and to recipients of software distributed by American Express, You reserve all
right, title, and interest, if any, in and to Your Contributions. Please [fill
out the Agreement](https://cla-assistant.io/americanexpress/sfdx-cli-helper).

Please feel free to open pull requests and see [CONTRIBUTING](./CONTRIBUTING.md) for commit formatting details.

## License

Any contributions made under this project will be governed by the [Apache License
2.0](https://github.com/americanexpress/sfdx-cli-helper/blob/master/LICENSE.txt).

## Code of Conduct

This project adheres to the [American Express Community Guidelines](./CODE_OF_CONDUCT.md).
By participating, you are expected to honor these guidelines.
