# nuget-package-check-action

[![CI-Main](https://github.com/BMTLab/nuget-package-check-action/actions/workflows/ci-main.yml/badge.svg)](https://github.com/BMTLab/nuget-package-check-action/actions/workflows/ci-main.yml)

- [x] Automates NuGet package availability checks, ensuring packages exist and are indexed on [nuget.org](https://nuget.org).
- [x] Supports multiple verification attempts and can suspend CI/CD workflows until the package is published.
- [x] Simple and fast. Uses pure JavaScript and makes only API call, without using Docker or any dependencies.

## How to use

:white_check_mark: To quickly check if the package exists and is available on NuGet, please add the following job:

```yaml
- name: Check Available NuGet Package
  uses: BMTLab/nuget-package-check-action@v1.2.0
  with:
    package: Your.AwesomePackage
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
  uses: BMTLab/nuget-package-check-action@v1.2.0
  with:
    package: Your.AwesomePackage # 👈🏻 Any valid NuGet Package name, not case-insensitive
    version: 1.3.505.01-beta     # 👈🏻 Version without any prefix ('v' e.g), not case-insensitive
    # 1, 1.0, 1.0.0 and 1.0.0.0 are suitable, 
    # it is also possible to specify the suffix via '-'

    attempts: 10 # The value must be > 0
  continue-on-error: true
```

:x: Input values will be validated, you will get an error if the format is incorrect.

### Outputs

:x: The job will terminate with an error if no package is found, please add `continue-on-error: true` to just get the checking result and not fail your workflow.

The action sets an output variable called `indexed`, which can be used in the following step by using: 

`${{ steps.check-nuget-package.outputs.indexed}}`, that can only have `'true'` or `'false'` values.

#### Example output usage

```yaml
- name: Push NuGet for ${{ env.PACKAGE_NAME }}
  if: ${{ steps.check-nuget-package.outputs.indexed != 'true' }}
  run: dotnet nuget push ./*.nupkg --source ${{ env.NUGET_URL }} --api-key ${{ secrets.NUGET_API_KEY }}
```

#### Action output log

```text
⮞ Run BMTLab/nuget-package-check-action@v1.2.0
Starting NuGet Package Index Checker...
Package Name: BMTLab.OneOf.Reduced
Package Version: 4.1.0424
Max Attempts: 12
Attempt 1 of 12: Package not indexed yet. Retrying in 30 seconds...
Attempt 2 of 12: Package not indexed yet. Retrying in 30 seconds...
Package BMTLab.OneOf.Reduced version 4.1.0424 is indexed on nuget.org.
Package indexed status: true
```

## Compatibility
| Ubuntu    | Windows |       MacOS |
|:----------|:-------:|------------:|
| :white_check_mark:  |  :white_check_mark:  | :white_check_mark: |

> [!IMPORTANT]
> When you're using self-hosted runners, please make sure you have _Node.js v20_ installed!

****************************
If you just want a script that does a package check, check out my **gist** with a bash script here: 
[check-nuget-pkg-indexed.sh](https://gist.github.com/BMTLab/28709f017c338a53e5845d04c00e6eb9)

## Contributing
Please feel free to fork this, contribute or let me know if you find a bug. 
Also, any ideas for improvement would be appreciated :innocent:

