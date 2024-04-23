# nuget-package-check-action

[![CI-Main](https://github.com/BMTLab/nuget-package-check-action/actions/workflows/ci-main.yml/badge.svg)](https://github.com/BMTLab/nuget-package-check-action/actions/workflows/ci-main.yml)

- [x] Automates NuGet package availability checks, ensuring packages exist and are indexed on [nuget.org](https://nuget.org).
- [x] Supports multiple verification attempts and can suspend CI/CD workflows until the package is published.

## How to use

:white_check_mark: To quickly check if the package exists and is available on NuGet, please add the following job:

```yaml
- name: Check Available NuGet Package
  uses: BMTLab/nuget-package-check-action@v1
  with:
    package: YourAwesomePackage
    version: 1.3.505
```

:white_check_mark: If your workflow publishes a package and further work requires that the package is already available and indexed,
please set a reasonable number of retries:

> [!TIP]
> The retry interval is 30 seconds,
so 10 retries are usually enough time between publishing and when the package is indexed and available.

```yaml
- name: Check Available NuGet Package
  id: check-nuget-package
  uses: BMTLab/nuget-package-check-action@v1
  with:
    # Any valid NuGet Package name
    package: YourAwesomePackage

    # Version without any prefix. 
    # 1, 1.0, 1.0.0 and 1.0.0.0 are suitable, 
    # it is also possible to specify the suffix via -
    version: 1.3.505

    # The value must be > 0
    attempts: 10
  continue-on-error: true
```

Input values will be validated, you will get an error if the format is incorrect.

### Output

:x: The job will terminate with an error if no package is found.
Please add `continue-on-error: true` to just get the checking result.

The action sets an output variable called `indexed`, which can be used in the following step by using: 
`${{ steps.check-nuget-package.outputs.indexed}}`. It can only have `'true'` or `'false'` values.

## Compatibility
| Ubuntu    | Windows |       MacOS |
|:----------|:-------:|------------:|
| :white_check_mark:  |  :white_check_mark:  | :white_check_mark: |

> [!IMPORTANT]
> When you're using self-hosted runners, please make sure you have Node.js v20 installed!

****************************
If you just want a script that does a package check, check out my gist with a bash script here: 
[check-nuget-pkg-indexed.sh](https://gist.github.com/BMTLab/28709f017c338a53e5845d04c00e6eb9)

## Contributing
Please feel free to contribute or let me know if you find a bug. 
Also, any ideas for improvement would be appreciated :innocent:

