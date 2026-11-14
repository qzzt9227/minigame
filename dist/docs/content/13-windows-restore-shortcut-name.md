# Windows一键恢复快捷方式初始名称

> 桌面快捷方式被改名、被追加「 - 快捷方式」后缀，或者因批量整理变得面目全非时，用这个脚本一键还原成程序原本的显示名称。

Windows 桌面上的 `.lnk` 快捷方式，有时会在安装、迁移或批量重命名之后变成 `应用名 - 快捷方式`、`应用名 (2)`，甚至只剩一个看不出用途的名字。手动逐个改回去不仅费时，还容易改错目标。

这个脚本会扫描当前用户桌面与公共桌面上的全部快捷方式，结合开始菜单索引、快捷方式描述、目标程序的版本信息和目标文件名，自动推算并恢复原始名称。执行前会先列出预览，确认后才真正重命名，并且全程写入日志。

## ✨ 主要特性

- **只处理桌面快捷方式**：仅扫描当前用户桌面与公共桌面下的 `.lnk` 文件，不碰开始菜单和其他目录。
- **先预览、后执行**：列出每一条待重命名的旧名称、新名称与命名依据，按回车才会执行。
- **多级名称还原策略**：开始菜单完全匹配 → 开始菜单同目标匹配 → 快捷方式描述 → 程序版本信息 → 目标文件名 → 去除“ - 快捷方式”后缀。
- **自动避让重名**：目标名称已存在时自动追加 `(2)`、`(3)`，不会覆盖任何现有文件。
- **失败可追踪**：成功、失败、跳过、未变化分别统计，日志写入 `%TEMP%\DesktopShortcutRename_时间戳.log`。
- **两种实现可选**：原版批处理 + Windows 自带 PowerShell；新增的 WSF 版只使用 Windows Script Host，不依赖 PowerShell，适合受控或精简系统。
- **PowerShell 版本自检**：启动时读取 `$PSVersionTable`，显示 PowerShell 版本、PSEdition 与 CLR 版本，并判断是否达到 5.1。
- **StartLayout 自检**：原版启动时自动检查 `Get-StartApps`，若 StartLayout 尚未加载则强制导入模块，避免开始菜单应用名匹配静默失效。
- **纯系统组件实现**：两版都不需要安装任何第三方工具，WSF 版只需 Windows 自带的 WSH。

## 📥 一键下载原版脚本

:::download
file=resources/Restore-shortcut-to-its-original-name.cmd
title=Restore-shortcut-to-its-original-name.cmd
desc=Windows 10 / 11 桌面快捷方式名称恢复脚本，启动时显示 PowerShell 版本并自动检查 StartLayout，需以管理员身份运行。
badge=CMD
size=17.9 KB
:::

> 备用入口：[下载 Restore-shortcut-to-its-original-name.cmd](../resources/Restore-shortcut-to-its-original-name.cmd)
>
> 资源目录：`dist/docs/resources/`。后续文章需要的小体积脚本、工具或示例文件都可以放在这里，并在 `resources/manifest.json` 中登记，页面会自动出现在「可下载资源中心」。

## 🚀 使用方法

1. 点击上方「📥 一键下载」，把 `Restore-shortcut-to-its-original-name.cmd` 保存到本地。
2. 在文件上右键，选择「以管理员身份运行」。脚本需要管理员权限才能处理公共桌面。
3. 等待脚本扫描完成，检查终端中列出的待重命名清单。
4. 确认无误后按 `Enter` 开始重命名；如果不满意，按 `Ctrl + C` 取消即可。
5. 执行结束后按 `Enter` 退出，根据提示查看日志文件。

> 建议第一次运行时先只观察预览，确认命名依据符合预期后再执行。

## 🛡️ 安全与注意事项

- 脚本**只重命名快捷方式文件本身**，不会修改快捷方式指向的程序、参数或工作目录。
- 公共桌面（`C:\Users\Public\Desktop`）中的快捷方式也会被处理，因此需要管理员权限。
- 重命名使用系统原生文件操作（原版为 `Rename-Item`，WSF 版为 `MoveFile`），不会删除文件；遇到重名会自动编号。
- 如果某个快捷方式无法推断出可靠名称，脚本会保持原样并记录为“跳过”，不会强行改名。
- 日志默认保存在 `%TEMP%` 目录，文件名形如 `DesktopShortcutRename_20261031_180000.log`。
- 企业环境或受控电脑上，请先确认有修改桌面文件的权限，并遵循所在组织的安全规范。

## 🧠 名称还原优先级

| 优先级 | 名称来源 | 说明 |
| --- | --- | --- |
| 0 | 应用列表 | 解析 `shell:AppsFolder` 启动参数，匹配应用显示名（原版用 `Get-StartApps`，WSF 版遍历 `shell:AppsFolder`） |
| 1 | 开始菜单 | 目标路径与启动参数完全一致的开始菜单快捷方式名称 |
| 2 | 开始菜单 | 仅目标路径一致、且只匹配到一个开始菜单项时采用 |
| 3 | 快捷方式描述 | 快捷方式属性中的“备注/描述”，做严格可用性校验 |
| 4 | 程序信息 | 目标程序的 `FileDescription` 版本信息 |
| 5 | 目标文件名 | 目标程序文件名（对 `.exe` 等去掉扩展名） |
| 9 | 去除后缀 | 当前名称去掉“ - 快捷方式 / - shortcut”等后缀 |
| 99 | 保留原名 | 以上都无法推断时，保持当前名称不变 |

## 💻 完整脚本代码（原版 CMD）

> 下面是与下载文件完全一致的完整源码，方便在无法下载时手动复制保存为 `.cmd` 文件。

```bat
@echo off
setlocal DisableDelayedExpansion

set "SELF=%~f0"
set "PS=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"

"%SystemRoot%\System32\fltmc.exe" >nul 2>&1
if not errorlevel 1 goto elevated

"%PS%" -NoProfile -ExecutionPolicy Bypass -Command "try { Start-Process -FilePath $env:SELF -WorkingDirectory (Split-Path -Parent $env:SELF) -Verb RunAs -ErrorAction Stop } catch { Write-Host ''; Write-Host 'Administrator rights are required.' -ForegroundColor Red; Write-Host 'Right-click this file and choose Run as administrator.'; Write-Host ''; exit 1 }"
if errorlevel 1 pause
exit /b

:elevated
"%PS%" -NoProfile -ExecutionPolicy Bypass -Command "$s=[IO.File]::ReadAllText($env:SELF); $m='#PS'+'START#'; $i=$s.IndexOf($m); if($i -lt 0){ Write-Host 'Cannot read the script payload.' -ForegroundColor Red; exit 1 }; iex $s.Substring($i+$m.Length)"
set "RC=%ERRORLEVEL%"
if not "%RC%"=="0" pause
exit /b %RC%

#PSSTART#
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
try {
    if ([Console]::IsOutputRedirected) {
        [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false
    }
    if ([Console]::IsInputRedirected) {
        [Console]::InputEncoding = New-Object System.Text.UTF8Encoding $false
    }
} catch { }
try { $Host.UI.RawUI.WindowTitle = '恢复桌面快捷方式原始名称' } catch { }

function Write-Title {
    param([string]$Text)
    Write-Host ''
    Write-Host $Text -ForegroundColor Cyan
    Write-Host ('=' * 62) -ForegroundColor DarkCyan
}

function Get-TargetKey {
    param(
        [string]$Target,
        [string]$Arguments,
        [switch]$IgnoreArguments
    )
    if ([string]::IsNullOrWhiteSpace($Target)) { return $null }
    $t = $Target.Trim().Trim('"')
    try { $t = [IO.Path]::GetFullPath($t) } catch { }
    $t = $t.TrimEnd('\')
    if ($IgnoreArguments) { return $t.ToLowerInvariant() }
    $a = ''
    if (-not [string]::IsNullOrWhiteSpace($Arguments)) {
        $a = ($Arguments.Trim() -replace '\s+', ' ').ToLowerInvariant()
    }
    return ($t.ToLowerInvariant() + '|' + $a)
}

function Get-ShortcutData {
    param([string]$Path)
    try {
        $sc = $script:WshShell.CreateShortcut($Path)
        return [pscustomobject]@{
            Target           = [string]$sc.TargetPath
            Arguments        = [string]$sc.Arguments
            WorkingDirectory = [string]$sc.WorkingDirectory
            Description      = [string]$sc.Description
        }
    } catch {
        return $null
    }
}

function ConvertTo-SafeName {
    param([string]$Name)
    if ([string]::IsNullOrWhiteSpace($Name)) { return $null }
    $n = $Name.Trim()
    $n = $n -replace '[\x00-\x1F\x7F]', ' '
    foreach ($ch in [IO.Path]::GetInvalidFileNameChars()) {
        $n = $n.Replace([string]$ch, ' ')
    }
    $n = $n -replace '\s{2,}', ' '
    $n = $n.Trim().TrimEnd('.')
    if ($n.Length -gt 120) {
        $n = $n.Substring(0, 120).Trim().TrimEnd('.')
    }
    if ([string]::IsNullOrWhiteSpace($n)) { return $null }
    if ($n -match '(?i)^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$') {
        $n += '_'
    }
    return $n
}

function Test-UsableLabel {
    param(
        [string]$Text,
        [int]$MaxLength = 80,
        [switch]$Strict
    )
    if ([string]::IsNullOrWhiteSpace($Text)) { return $false }
    $t = $Text.Trim()
    if ($t.Length -gt $MaxLength) { return $false }
    if ($t -match '[\r\n\t]') { return $false }
    if ($t -match '^[A-Za-z]:\\|^\\\\|^https?://|^shell:|^\{') { return $false }
    if ($t -match '(?i)^(launch|open|start|run)\s+') { return $false }
    if ($t -match '^(打开|启动|运行)') { return $false }
    if ($t -match '(?i)\.(exe|dll|ico|lnk)$') { return $false }
    if ($t -match '(?i)^(application|windows application|program)$') { return $false }
    if ($Strict) {
        if ($t -match '\s[-|:]\s') { return $false }
        if ($t -match '[。！？!?]$') { return $false }
        if ($t -match '\s{3,}') { return $false }
        if (($t -split '\s+').Count -gt 6) { return $false }
    }
    return $true
}

function Add-IndexValue {
    param(
        [hashtable]$Index,
        [string]$Key,
        [string]$Name
    )
    if ([string]::IsNullOrWhiteSpace($Key) -or [string]::IsNullOrWhiteSpace($Name)) { return }
    if (-not $Index.ContainsKey($Key)) {
        $Index[$Key] = New-Object 'System.Collections.Generic.List[string]'
    }
    if (-not $Index[$Key].Contains($Name)) {
        $Index[$Key].Add($Name)
    }
}

function Test-IsCleanPrefix {
    param(
        [string]$Current,
        [string]$Candidate
    )
    if ([string]::IsNullOrWhiteSpace($Current) -or [string]::IsNullOrWhiteSpace($Candidate)) {
        return $false
    }
    if ($Candidate -eq $Current) { return $true }
    return $Candidate.StartsWith($Current + '.', [StringComparison]::OrdinalIgnoreCase)
}

function Get-OriginalName {
    param(
        [object]$Item,
        [hashtable]$ExactIndex,
        [hashtable]$TargetIndex,
        [hashtable]$StartAppNames
    )
    $data = $Item.Data
    $names = New-Object 'System.Collections.Generic.List[object]'
    $current = ConvertTo-SafeName -Name $Item.File.BaseName

    if ($null -ne $data) {
        if (-not [string]::IsNullOrWhiteSpace($data.Arguments) -and
            $data.Arguments -match 'shell:AppsFolder\\([^"]+?)\s*$') {
            $appId = $Matches[1].Trim()
            if ($StartAppNames.ContainsKey($appId)) {
                $names.Add([pscustomobject]@{ Name = $StartAppNames[$appId]; Source = '应用列表'; Rank = 0 })
            }
        }

        if (-not [string]::IsNullOrWhiteSpace($data.Target)) {
            $exactKey = Get-TargetKey -Target $data.Target -Arguments $data.Arguments
            if ($exactKey -and $ExactIndex.ContainsKey($exactKey)) {
                foreach ($n in $ExactIndex[$exactKey]) {
                    $names.Add([pscustomobject]@{ Name = $n; Source = '开始菜单'; Rank = 1 })
                }
            }
            if ($names.Count -eq 0) {
                $targetKey = Get-TargetKey -Target $data.Target -Arguments '' -IgnoreArguments
                if ($targetKey -and $TargetIndex.ContainsKey($targetKey) -and
                    $TargetIndex[$targetKey].Count -eq 1) {
                    $names.Add([pscustomobject]@{ Name = $TargetIndex[$targetKey][0]; Source = '开始菜单'; Rank = 2 })
                }
            }
        }

        if (Test-UsableLabel -Text $data.Description -MaxLength 32 -Strict) {
            $names.Add([pscustomobject]@{ Name = $data.Description; Source = '快捷方式描述'; Rank = 3 })
        }

        $isShellLink = ($data.Arguments -match '(?i)shell:')
        if (-not [string]::IsNullOrWhiteSpace($data.Target) -and
            (Test-Path -LiteralPath $data.Target -PathType Leaf) -and
            -not $isShellLink) {
            try {
                $vi = [Diagnostics.FileVersionInfo]::GetVersionInfo($data.Target)
                if (Test-UsableLabel -Text $vi.FileDescription -MaxLength 70) {
                    $fileDesc = ConvertTo-SafeName -Name $vi.FileDescription
                    if (-not (Test-IsCleanPrefix -Current $current -Candidate $fileDesc)) {
                        $names.Add([pscustomobject]@{ Name = $vi.FileDescription; Source = '程序信息'; Rank = 4 })
                    }
                }
            } catch { }
        }

        if (-not [string]::IsNullOrWhiteSpace($data.Target) -and -not $isShellLink) {
            $leaf = Split-Path -Leaf $data.Target
            if (-not [string]::IsNullOrWhiteSpace($leaf)) {
                $leafName = $leaf
                if ($leaf -match '(?i)\.(exe|com|bat|cmd|msi)$') {
                    $leafName = [IO.Path]::GetFileNameWithoutExtension($leaf)
                    if (Test-IsCleanPrefix -Current $current -Candidate $leafName) {
                        $leafName = $null
                    }
                }
                if (-not [string]::IsNullOrWhiteSpace($leafName) -and
                    (Test-UsableLabel -Text $leafName)) {
                    $names.Add([pscustomobject]@{ Name = $leafName; Source = '目标文件名'; Rank = 5 })
                }
            }
        }
    }

    if (-not [string]::IsNullOrWhiteSpace($current)) {
        $clean = $current -replace '(?i)\s*[-–—]\s*(快捷方式|shortcut)$', ''
        if ($clean -ne $current -and (Test-UsableLabel -Text $clean)) {
            $names.Add([pscustomobject]@{ Name = $clean; Source = '去除后缀'; Rank = 9 })
        }
    }

    $valid = New-Object 'System.Collections.Generic.List[object]'
    foreach ($n in $names) {
        $safe = ConvertTo-SafeName -Name $n.Name
        if (-not [string]::IsNullOrWhiteSpace($safe)) {
            $valid.Add([pscustomobject]@{ Name = $safe; Source = $n.Source; Rank = $n.Rank })
        }
    }

    if ($valid.Count -eq 0) {
        if (-not [string]::IsNullOrWhiteSpace($current)) {
            return [pscustomobject]@{ Name = $current; Source = '保留原名'; Rank = 99 }
        }
        return $null
    }

    if (-not [string]::IsNullOrWhiteSpace($current)) {
        foreach ($v in $valid) {
            if ($v.Name -eq $current) { return $v }
        }
    }

    return ($valid | Sort-Object Rank, @{ Expression = { $_.Name.Length } } | Select-Object -First 1)
}

$script:WshShell = New-Object -ComObject WScript.Shell
$script:LogLines = New-Object 'System.Collections.Generic.List[string]'
function Add-Log {
    param([string]$Line)
    $script:LogLines.Add($Line)
}

$desktopDirs = @(
    [Environment]::GetFolderPath('Desktop')
    [Environment]::GetFolderPath('CommonDesktopDirectory')
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) } | Select-Object -Unique

$startRoots = @(
    [Environment]::GetFolderPath('CommonStartMenu')
    [Environment]::GetFolderPath('StartMenu')
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) } | Select-Object -Unique

function Enable-StartLayoutModule {
    if (Get-Command -Name Get-StartApps -ErrorAction SilentlyContinue) {
        return $true
    }

    $systemModuleRoot = [IO.Path]::Combine($env:SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'Modules')
    if ((Test-Path -LiteralPath $systemModuleRoot) -and
        ($env:PSModulePath -notlike "*$systemModuleRoot*")) {
        $env:PSModulePath = "$systemModuleRoot;$env:PSModulePath"
    }

    $module = Get-Module -ListAvailable -Name StartLayout -ErrorAction SilentlyContinue |
        Select-Object -First 1
    if ($null -ne $module -and -not [string]::IsNullOrWhiteSpace($module.Path)) {
        try {
            Import-Module -Name $module.Path -Force -ErrorAction Stop
        } catch { }
    }

    if (-not (Get-Command -Name Get-StartApps -ErrorAction SilentlyContinue)) {
        try {
            Import-Module -Name StartLayout -Force -ErrorAction Stop
        } catch { }
    }

    return [bool](Get-Command -Name Get-StartApps -ErrorAction SilentlyContinue)
}

Write-Host ''
$psVersion = $PSVersionTable.PSVersion
$psEditionName = 'Desktop'
if ($PSVersionTable.ContainsKey('PSEdition')) {
    $psEditionName = [string]$PSVersionTable.PSEdition
}
$psDetails = '{0}（{1}）' -f $psVersion, $psEditionName
if ($PSVersionTable.ContainsKey('CLRVersion')) {
    $psDetails += ' / CLR ' + $PSVersionTable.CLRVersion
}
Write-Host ('[检查] PowerShell 版本：' + $psDetails) -ForegroundColor DarkGray
if (($psVersion.Major -lt 5) -or (($psVersion.Major -eq 5) -and ($psVersion.Minor -lt 1))) {
    Write-Host '[警告] 当前 PowerShell 低于 5.1，建议升级后再运行。' -ForegroundColor Yellow
} else {
    Write-Host '[检查] PowerShell 版本满足脚本要求。' -ForegroundColor DarkGray
}

Write-Host '[检查] StartLayout 模块...' -ForegroundColor DarkGray
if (-not (Enable-StartLayoutModule)) {
    Write-Host '[警告] StartLayout 模块不可用，跳过开始菜单应用名匹配，继续使用其他策略。' -ForegroundColor Yellow
}

$startAppNames = @{}
try {
    foreach ($app in (Get-StartApps -ErrorAction Stop)) {
        if (-not [string]::IsNullOrWhiteSpace($app.AppID)) {
            $startAppNames[[string]$app.AppID] = [string]$app.Name
        }
    }
} catch { }

$exactIndex = @{}
$targetIndex = @{}
foreach ($root in $startRoots) {
    $startLinks = @(Get-ChildItem -LiteralPath $root -Filter '*.lnk' -File -Recurse -Force -ErrorAction SilentlyContinue)
    foreach ($link in $startLinks) {
        $sd = Get-ShortcutData -Path $link.FullName
        if ($null -eq $sd -or [string]::IsNullOrWhiteSpace($sd.Target)) { continue }
        $exactKey = Get-TargetKey -Target $sd.Target -Arguments $sd.Arguments
        Add-IndexValue -Index $exactIndex -Key $exactKey -Name $link.BaseName
        $targetKey = Get-TargetKey -Target $sd.Target -Arguments '' -IgnoreArguments
        Add-IndexValue -Index $targetIndex -Key $targetKey -Name $link.BaseName
    }
}

if ($desktopDirs.Count -eq 0) {
    throw '没有找到桌面目录。'
}

$items = New-Object 'System.Collections.Generic.List[object]'
foreach ($dir in $desktopDirs) {
    $links = @(Get-ChildItem -LiteralPath $dir -Filter '*.lnk' -File -Force -ErrorAction SilentlyContinue)
    foreach ($link in $links) {
        $items.Add([pscustomobject]@{
            File = $link
            Dir  = $dir
            Data = Get-ShortcutData -Path $link.FullName
        })
    }
}

Write-Title '桌面快捷方式原始名称恢复'
Write-Host ('桌面目录：' + ($desktopDirs -join '  |  '))
Write-Host ('找到快捷方式：{0} 个' -f $items.Count)
Add-Log ('时间：' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
Add-Log ('PowerShell：' + $psDetails)
Add-Log ('桌面目录：' + ($desktopDirs -join ' | '))

$existing = @{}
foreach ($item in $items) {
    $existing[$item.File.FullName.ToLowerInvariant()] = $true
}
$plannedNames = @{}
$plan = New-Object 'System.Collections.Generic.List[object]'
$skipped = New-Object 'System.Collections.Generic.List[object]'
$unchanged = 0

foreach ($item in $items) {
    $original = Get-OriginalName -Item $item -ExactIndex $exactIndex -TargetIndex $targetIndex -StartAppNames $startAppNames
    if ($null -eq $original) {
        $skipped.Add([pscustomobject]@{ Name = $item.File.BaseName; Reason = '无法解析原始名称' })
        Add-Log ('跳过：' + $item.File.FullName + ' -> 无法解析原始名称')
        continue
    }
    if ($original.Name -eq $item.File.BaseName) {
        $unchanged++
        Add-Log ('不变：' + $item.File.FullName)
        continue
    }

    $desired = $original.Name
    $final = $desired
    $n = 2
    while ($true) {
        $candidatePath = Join-Path $item.Dir ($final + '.lnk')
        $candidateKey = $candidatePath.ToLowerInvariant()
        $isSelf = ($candidateKey -eq $item.File.FullName.ToLowerInvariant())
        if (-not $isSelf -and -not $existing.ContainsKey($candidateKey) -and -not $plannedNames.ContainsKey($candidateKey)) {
            break
        }
        $final = ('{0} ({1})' -f $desired, $n)
        $n++
        if ($n -gt 100) { break }
    }

    if ($final -eq $item.File.BaseName) {
        $unchanged++
        continue
    }

    $plan.Add([pscustomobject]@{
        Path    = $item.File.FullName
        Dir     = $item.Dir
        OldName = $item.File.BaseName
        NewName = $final
        Source  = $original.Source
    })
    $plannedNames[(Join-Path $item.Dir ($final + '.lnk')).ToLowerInvariant()] = $true
    Add-Log ('计划：' + $item.File.FullName + ' -> ' + $final + '.lnk（来源：' + $original.Source + '）')
}

if ($unchanged -gt 0) {
    Write-Host ('已是原始名称：{0} 个' -f $unchanged) -ForegroundColor Green
}
if ($skipped.Count -gt 0) {
    Write-Host ('无法确定原始名称：{0} 个（保持原样）' -f $skipped.Count) -ForegroundColor DarkYellow
    foreach ($s in $skipped) {
        Write-Host ('  - ' + $s.Name) -ForegroundColor DarkGray
    }
}

if ($plan.Count -eq 0) {
    Write-Host ''
    Write-Host '没有需要重命名的快捷方式。' -ForegroundColor Green
    Add-Log '结果：没有需要重命名的快捷方式。'
} else {
    Write-Host ''
    Write-Host ('准备重命名 {0} 个快捷方式：' -f $plan.Count) -ForegroundColor Yellow
    foreach ($p in $plan) {
        Write-Host ('  [{0}] {1}  ->  {2}' -f $p.Source, $p.OldName, $p.NewName)
    }
    Write-Host ''
    Write-Host '按回车开始重命名（按 Ctrl+C 取消）...' -ForegroundColor Yellow
    try { [void](Read-Host) } catch { }

    $ok = 0
    $fail = 0
    foreach ($p in $plan) {
        try {
            Rename-Item -LiteralPath $p.Path -NewName ($p.NewName + '.lnk') -ErrorAction Stop
            $ok++
            Write-Host ('  [成功] {0}  ->  {1}' -f $p.OldName, $p.NewName) -ForegroundColor Green
            Add-Log ('成功：' + $p.Path + ' -> ' + $p.NewName + '.lnk')
        } catch {
            $fail++
            Write-Host ('  [失败] {0}：{1}' -f $p.OldName, $_.Exception.Message) -ForegroundColor Red
            Add-Log ('失败：' + $p.Path + ' -> ' + $p.NewName + '.lnk；' + $_.Exception.Message)
        }
    }

    Write-Host ''
    $summary = '完成：成功 {0} 个，失败 {1} 个，未变 {2} 个，跳过 {3} 个。' -f $ok, $fail, $unchanged, $skipped.Count
    if ($fail -gt 0) {
        Write-Host $summary -ForegroundColor Yellow
    } else {
        Write-Host $summary -ForegroundColor Green
    }
    Add-Log ('结果：' + $summary)
}

$logPath = Join-Path $env:TEMP ('DesktopShortcutRename_{0}.log' -f (Get-Date -Format 'yyyyMMdd_HHmmss'))
try {
    $script:LogLines | Set-Content -LiteralPath $logPath -Encoding UTF8
    Write-Host ('日志：' + $logPath) -ForegroundColor DarkGray
} catch {
    Write-Host ('日志写入失败：' + $_.Exception.Message) -ForegroundColor DarkGray
}

Write-Host ''
Write-Host '按回车退出...' -ForegroundColor Yellow
try { [void](Read-Host) } catch { }
```

## 🧰 原版脚本用了哪些工具？

原版 `Restore-shortcut-to-its-original-name.cmd` 看起来是一个 `.cmd` 文件，但它并不是“只用 cmd”完成的：批处理只负责启动、检测权限和提权，真正的扫描、名称推断与重命名全部交给 PowerShell。

| 工具 / 组件 | 在原版中的用途 | 来源 |
| --- | --- | --- |
| `cmd.exe` | 批处理外壳、读取参数、启动提权流程 | Windows 自带 |
| `fltmc.exe` | 检测当前窗口是否具有管理员权限 | Windows 自带 |
| `powershell.exe` | 执行全部核心逻辑：扫描、推断、预览、重命名、写日志 | Windows 10 / 11 自带 Windows PowerShell 5.1 |
| `WScript.Shell` COM | 通过 `CreateShortcut` 读取和写入 `.lnk` 文件 | Windows 自带 |
| `Get-StartApps` | 枚举开始菜单应用，把 `shell:AppsFolder` 的 AppID 映射为应用显示名 | StartLayout 模块；脚本启动时会自动检查并强制加载 |
| `System.Diagnostics.FileVersionInfo` | 读取目标程序的 `FileDescription` 版本信息 | .NET，由 PowerShell 提供 |
| `Get-ChildItem` / `Rename-Item` | 递归扫描开始菜单、重命名桌面快捷方式 | PowerShell 内置命令 |
| `%TEMP%` | 写入本次操作日志 | Windows 自带 |

因此，原版虽然**不需要安装任何第三方软件**，但仍依赖 PowerShell 5.1、.NET 与 StartLayout 模块。在 PowerShell 被 AppLocker / ExecutionPolicy 限制、`Get-StartApps` 不可用，或者系统被精简过的环境里，它可能无法完整工作。

> 启动自检：脚本会在扫描开始前检查 `Get-StartApps` 是否存在；如果 StartLayout 尚未加载，会先把系统模块目录加入 `PSModulePath`，再执行 `Import-Module StartLayout -Force`。若模块确实被系统精简，会输出黄色警告并跳过应用名匹配，继续使用开始菜单、描述、版本信息与目标文件名等策略，不会直接中断。

### PowerShell 版本自检

脚本在扫描前读取 `$PSVersionTable`，显示 PowerShell 版本、PSEdition 与 CLR 版本，并判断是否达到 5.1：

```powershell
$psVersion = $PSVersionTable.PSVersion
$psEditionName = 'Desktop'
if ($PSVersionTable.ContainsKey('PSEdition')) { $psEditionName = [string]$PSVersionTable.PSEdition }
$psDetails = '{0}（{1}）' -f $psVersion, $psEditionName
if ($PSVersionTable.ContainsKey('CLRVersion')) { $psDetails += ' / CLR ' + $PSVersionTable.CLRVersion }
Write-Host ('[检查] PowerShell 版本：' + $psDetails)
if (($psVersion.Major -lt 5) -or (($psVersion.Major -eq 5) -and ($psVersion.Minor -lt 1))) {
    Write-Host '[警告] 当前 PowerShell 低于 5.1，建议升级后再运行。' -ForegroundColor Yellow
}
```

版本信息只用于展示和告警，不会自动升级 PowerShell；同一份版本信息也会写入操作日志。注意变量名使用 `$psEditionName` 而不是 `$psEdition`，避免与 PowerShell 只读自动变量 `$PSEdition` 冲突。

### StartLayout 自检与强制启用

原版脚本不要求你手动打开 PowerShell。它在主流程开始前执行等价的检查：

```powershell
if (-not (Get-Command Get-StartApps -ErrorAction SilentlyContinue)) {
    $root = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\Modules'
    if ($env:PSModulePath -notlike "*$root*") { $env:PSModulePath = "$root;$env:PSModulePath" }
    Import-Module StartLayout -Force -ErrorAction Stop
}
```

注意：StartLayout 是 Windows PowerShell 自带模块，不是「Windows 可选功能」，因此没有对应的 `Enable-WindowsOptionalFeature` 功能名；这里所说的“启用”就是把模块目录加入搜索路径并强制导入，且只影响当前 PowerShell 进程，不会修改系统全局配置。WSF 版不调用 PowerShell，也不使用 `Get-StartApps`，所以不需要这一步。

## 🪶 纯 Windows 零依赖版（WSF）

下面这一版把 PowerShell 全部替换为 Windows Script Host（WSH）原生的 VBScript，只使用 Windows 自带的 `cscript.exe` / `wscript.exe`、`WScript.Shell`、`Scripting.FileSystemObject`、`Shell.Application` 与 `fltmc.exe`。它不调用 PowerShell，不依赖 .NET SDK，也不需要 Python、Node.js 或任何第三方 EXE。

:::download
file=resources/Restore-shortcut-to-its-original-name-pure.wsf
title=Restore-shortcut-to-its-original-name-pure.wsf
desc=纯 Windows 零依赖版：不调用 PowerShell，仅使用系统自带 WSH / Shell.Application / FSO。
badge=WSF
size=26.3 KB
:::

> 备用入口：[下载 Restore-shortcut-to-its-original-name-pure.wsf](../resources/Restore-shortcut-to-its-original-name-pure.wsf)

### 它如何替代原版

| 原版能力 | WSF 版实现 |
| --- | --- |
| PowerShell `CreateShortcut` | `WScript.Shell.CreateShortcut` |
| `Get-StartApps` 枚举应用 | `Shell.Application.NameSpace("shell:AppsFolder")` 遍历应用项，读取 `System.AppUserModel.ID` |
| `FileVersionInfo.FileDescription` | Shell 扩展属性 `System.FileDescription` / `FileDescription` |
| `Rename-Item` | `Scripting.FileSystemObject.MoveFile` |
| `Start-Process -Verb RunAs` | `Shell.Application.ShellExecute ..., "runas"` |
| `Read-Host` 等待确认 | `WScript.StdIn.ReadLine` |
| `.cmd` 外壳 + PowerShell 载荷 | 单个 `.wsf` 文件 + `cscript` 控制台 |

名称还原的优先级、冲突时追加 `(2)` / `(3)`、预览后再执行、失败统计与 `%TEMP%` 日志，均与原版保持一致。

### 使用方法

1. 下载 `Restore-shortcut-to-its-original-name-pure.wsf`，保存到桌面或任意目录。
2. 双击文件。WSH 会自动切换到 `cscript` 控制台，检测管理员权限；如果没有权限，会弹出 UAC 提权。
3. 检查终端中列出的旧名称、新名称与命名依据。
4. 确认无误后按 `Enter` 开始重命名；按 `Ctrl + C` 可随时取消。
5. 结束后按 `Enter` 退出，终端会输出本次日志的完整路径。

如果文件是从浏览器下载的，Windows 可能给它加上“来自 Internet”的标记。若双击没有反应或被 SmartScreen 拦截，右键文件 →「属性」→ 勾选「解除锁定」后再运行。

### 安全测试模式

不想直接动真实桌面时，可以先用测试目录验证：

```bat
cscript //nologo Restore-shortcut-to-its-original-name-pure.wsf /test:"D:\test-lnk" /start:"D:\empty-start" /yes
```

- `/test:<目录>`：只扫描指定目录中的 `.lnk`，不碰真实桌面。
- `/start:<目录>`：使用指定目录作为“开始菜单索引”；传一个空目录可模拟“没有开始菜单参考”的情况。
- `/yes`：跳过回车确认，适合自动化测试。

### 兼容性与限制

- Windows 7 / 8 / 8.1 / 10 / 11 默认自带 Windows Script Host；`shell:AppsFolder` 应用列表主要从 Windows 10 开始可用，旧系统会自动退回到开始菜单、描述、程序信息与目标文件名等策略。
- Windows 11 24H2 起，VBScript 变为“按需功能”。如果系统已通过组策略或可选功能移除 VBScript，`.wsf` 将无法运行；此时可启用「VBScript」可选功能，或继续使用上面的原版 CMD。
- 脚本只重命名 `.lnk` 文件本身，不修改快捷方式指向的程序、参数或工作目录；遇到无法可靠推断的名称会保持原样。
- 公共桌面需要管理员权限；UAC 被取消时脚本会直接退出，不会做任何修改。

### 完整代码

> 下面是完整源码，与下载文件一致。请保存为 `.wsf` 文件（UTF-8），不要改名为 `.vbs`，以免中文编码或 XML 声明出错。

```wsf
<?xml version="1.0" encoding="UTF-8"?>
<job>
<script language="VBScript">
<![CDATA[
Option Explicit

' ============================================================
'  Windows 桌面快捷方式原始名称恢复（纯 Windows 零依赖版）
'  仅使用 Windows 自带：cscript.exe / WScript.Shell / FSO /
'  Shell.Application / fltmc.exe。不依赖 PowerShell、.NET SDK、
'  Python、Node.js 或任何第三方工具。
' ============================================================

Dim gShell, gFso, gShellApp, gScriptPath, gCscript, gRawArgs
Dim gTestDir, gStartOverride, gAutoYes

Set gShell = CreateObject("WScript.Shell")
Set gFso = CreateObject("Scripting.FileSystemObject")
Set gShellApp = CreateObject("Shell.Application")
gScriptPath = WScript.ScriptFullName
gCscript = gShell.ExpandEnvironmentStrings("%SystemRoot%\System32\cscript.exe")

ParseArgs

If Not IsCscript() Then
    RelaunchConsole
    WScript.Quit 0
End If

If gTestDir = "" Then
    If Not IsAdmin() Then
        Elevate
        WScript.Quit 0
    End If
End If

Main

' ------------------------------------------------------------
' 启动、参数与权限
' ------------------------------------------------------------
Sub ParseArgs()
    Dim i, a
    gTestDir = ""
    gStartOverride = ""
    gAutoYes = False
    gRawArgs = ""
    For i = 0 To WScript.Arguments.Count - 1
        a = WScript.Arguments(i)
        If LCase(Left(a, 6)) = "/test:" Then
            gTestDir = TrimEx(Replace(Mid(a, 7), """", ""))
            If gTestDir <> "" Then gTestDir = gFso.GetAbsolutePathName(gTestDir)
        ElseIf LCase(Left(a, 7)) = "/start:" Then
            gStartOverride = TrimEx(Replace(Mid(a, 8), """", ""))
            If gStartOverride <> "" Then gStartOverride = gFso.GetAbsolutePathName(gStartOverride)
        ElseIf LCase(TrimEx(a)) = "/yes" Then
            gAutoYes = True
        End If
    Next

    gRawArgs = ""
    If gTestDir <> "" Then gRawArgs = gRawArgs & " " & QuoteArg("/test:" & gTestDir)
    If gStartOverride <> "" Then gRawArgs = gRawArgs & " " & QuoteArg("/start:" & gStartOverride)
    If gAutoYes Then gRawArgs = gRawArgs & " /yes"
End Sub

Function IsCscript()
    IsCscript = (InStr(1, LCase(WScript.FullName), "cscript.exe", vbTextCompare) > 0)
End Function

Sub RelaunchConsole()
    Dim cmd
    cmd = """" & gCscript & """ //nologo """ & gScriptPath & """" & gRawArgs
    gShell.Run cmd, 1, False
End Sub

Function IsAdmin()
    Dim rc, cmd
    cmd = gShell.ExpandEnvironmentStrings("%ComSpec%") & " /c fltmc >nul 2>&1"
    On Error Resume Next
    rc = gShell.Run(cmd, 0, True)
    If Err.Number <> 0 Then
        Err.Clear
        rc = 1
    End If
    On Error GoTo 0
    IsAdmin = (rc = 0)
End Function

Sub Elevate()
    On Error Resume Next
    gShellApp.ShellExecute gCscript, "//nologo """ & gScriptPath & """" & gRawArgs, "", "runas", 1
    If Err.Number <> 0 Then
        MsgBox "需要管理员权限才能处理公共桌面上的快捷方式。" & vbCrLf & _
               "请右键此文件，选择“以管理员身份运行”。", 16, "恢复快捷方式名称"
        Err.Clear
    End If
    On Error GoTo 0
End Sub

Sub Pause()
    WScript.StdOut.Write "按回车退出..."
    On Error Resume Next
    WScript.StdIn.ReadLine
    On Error GoTo 0
    WScript.StdOut.WriteLine ""
End Sub

Sub WaitEnter(msg)
    WScript.StdOut.WriteLine ""
    WScript.StdOut.Write msg
    On Error Resume Next
    WScript.StdIn.ReadLine
    On Error GoTo 0
    WScript.StdOut.WriteLine ""
End Sub

' ------------------------------------------------------------
' 通用字符串/路径/字典
' ------------------------------------------------------------
Function TrimEx(value)
    Dim s, re
    s = value & ""
    Set re = New RegExp
    re.Pattern = "^\s+|\s+$"
    re.Global = True
    TrimEx = re.Replace(s, "")
End Function

Function QuoteArg(value)
    QuoteArg = """" & Replace(value & "", """", """""") & """"
End Function

Function LCaseKey(value)
    LCaseKey = LCase(TrimEx(value & ""))
End Function

Function IsLnk(fileName)
    IsLnk = (LCase(Right(fileName & "", 4)) = ".lnk")
End Function

Sub AddIndex(index, key, name)
    Dim list
    If key = "" Or TrimEx(name & "") = "" Then Exit Sub
    If Not index.Exists(key) Then
        Set list = CreateObject("Scripting.Dictionary")
        list.CompareMode = 1
        Set index(key) = list
    End If
    Set list = index(key)
    list(TrimEx(name & "")) = True
End Sub

Function IndexCount(index, key)
    Dim list
    IndexCount = 0
    If key = "" Then Exit Function
    If Not index.Exists(key) Then Exit Function
    Set list = index(key)
    IndexCount = list.Count
End Function

Function IndexName(index, key, idx)
    Dim list, names
    IndexName = ""
    If key = "" Or Not index.Exists(key) Then Exit Function
    Set list = index(key)
    names = list.Keys
    If idx >= 0 And idx <= UBound(names) Then IndexName = names(idx)
End Function

' ------------------------------------------------------------
' 快捷方式读取与目标键
' ------------------------------------------------------------
Class ShortcutInfo
    Public Path
    Public Dir
    Public BaseName
    Public Target
    Public Args
    Public WorkDir
    Public Desc
    Public HasData
End Class

Class Candidate
    Public Name
    Public Source
    Public Rank
End Class

Class PlanItem
    Public Path
    Public Dir
    Public OldName
    Public NewName
    Public Source
End Class

Function ReadShortcut(path)
    Dim info, sc
    Set info = New ShortcutInfo
    info.Path = path
    info.Dir = gFso.GetParentFolderName(path)
    info.BaseName = gFso.GetBaseName(path)
    info.Target = ""
    info.Args = ""
    info.WorkDir = ""
    info.Desc = ""
    info.HasData = False

    On Error Resume Next
    Set sc = gShell.CreateShortcut(path)
    If Err.Number = 0 Then
        info.Target = TrimEx(sc.TargetPath & "")
        info.Args = TrimEx(sc.Arguments & "")
        info.WorkDir = TrimEx(sc.WorkingDirectory & "")
        info.Desc = TrimEx(sc.Description & "")
        info.HasData = True
    End If
    Err.Clear
    On Error GoTo 0
    Set ReadShortcut = info
End Function

Function CleanTarget(target)
    Dim s, absPath
    s = TrimEx(target & "")
    If Len(s) >= 2 Then
        If Left(s, 1) = """" And Right(s, 1) = """" Then
            s = TrimEx(Mid(s, 2, Len(s) - 2))
        End If
    End If
    CleanTarget = ""
    If s = "" Then Exit Function

    If InStr(1, s, "shell:", vbTextCompare) = 1 Then
        CleanTarget = LCase(s)
        Exit Function
    End If
    If InStr(s, "://") > 0 Or Left(s, 1) = "{" Then
        CleanTarget = LCase(s)
        Exit Function
    End If

    On Error Resume Next
    absPath = gFso.GetAbsolutePathName(s)
    If Err.Number = 0 And absPath <> "" Then s = absPath
    Err.Clear
    On Error GoTo 0

    Do While Len(s) > 0 And Right(s, 1) = "\"
        s = Left(s, Len(s) - 1)
    Loop
    CleanTarget = LCase(s)
End Function

Function NormalizeArgs(args)
    Dim s, re
    s = TrimEx(args & "")
    Set re = New RegExp
    re.Pattern = "\s+"
    re.Global = True
    s = re.Replace(s, " ")
    NormalizeArgs = LCase(TrimEx(s))
End Function

Function TargetKey(target, args, ignoreArgs)
    Dim t
    t = CleanTarget(target)
    TargetKey = ""
    If t = "" Then Exit Function
    If ignoreArgs Then
        TargetKey = t
    Else
        TargetKey = t & "|" & NormalizeArgs(args)
    End If
End Function

Function ExtractAppId(args)
    Dim re, matches
    ExtractAppId = ""
    Set re = New RegExp
    re.IgnoreCase = True
    re.Pattern = "shell:AppsFolder\\([^""]+?)\s*$"
    Set matches = re.Execute(args & "")
    If matches.Count > 0 Then
        ExtractAppId = TrimEx(matches(0).SubMatches(0))
    End If
End Function

' ------------------------------------------------------------
' 名称清洗与可用性判断
' ------------------------------------------------------------
Function SafeName(name)
    Dim s, i, ch, code, out, re
    s = TrimEx(name & "")
    SafeName = ""
    If s = "" Then Exit Function

    out = ""
    For i = 1 To Len(s)
        ch = Mid(s, i, 1)
        code = AscW(ch)
        If code < 0 Then code = code + 65536
        If code < 32 Or code = 127 Then
            out = out & " "
        ElseIf InStr(1, "\/:*?""<>|", ch, vbBinaryCompare) > 0 Then
            out = out & " "
        Else
            out = out & ch
        End If
    Next

    Set re = New RegExp
    re.Pattern = "\s{2,}"
    re.Global = True
    out = re.Replace(out, " ")
    out = TrimEx(out)
    Do While Len(out) > 0 And Right(out, 1) = "."
        out = Left(out, Len(out) - 1)
    Loop
    out = TrimEx(out)
    If Len(out) > 120 Then
        out = TrimEx(Left(out, 120))
        Do While Len(out) > 0 And Right(out, 1) = "."
            out = Left(out, Len(out) - 1)
        Loop
    End If
    If out = "" Then Exit Function

    Set re = New RegExp
    re.IgnoreCase = True
    re.Pattern = "^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$"
    If re.Test(out) Then out = out & "_"
    SafeName = out
End Function

Function HasControlChars(text)
    HasControlChars = (InStr(text & "", Chr(13)) > 0 Or InStr(text & "", Chr(10)) > 0 Or InStr(text & "", Chr(9)) > 0)
End Function

Function WordCount(text)
    Dim s, re, parts
    s = TrimEx(text & "")
    If s = "" Then
        WordCount = 0
        Exit Function
    End If
    Set re = New RegExp
    re.Pattern = "\s+"
    re.Global = True
    s = re.Replace(s, " ")
    parts = Split(s, " ")
    WordCount = UBound(parts) + 1
End Function

Function UsableLabel(text, maxLen, strict)
    Dim t, re
    t = TrimEx(text & "")
    UsableLabel = False
    If t = "" Or Len(t) > maxLen Then Exit Function
    If HasControlChars(t) Then Exit Function

    Set re = New RegExp
    re.IgnoreCase = True
    re.Pattern = "^[A-Za-z]:\\|^\\\\|^https?://|^shell:|^\{"
    If re.Test(t) Then Exit Function
    re.Pattern = "^(launch|open|start|run)\s+"
    If re.Test(t) Then Exit Function
    re.Pattern = "^(打开|启动|运行)"
    If re.Test(t) Then Exit Function
    re.Pattern = "\.(exe|dll|ico|lnk)$"
    If re.Test(t) Then Exit Function
    re.Pattern = "^(application|windows application|program)$"
    If re.Test(t) Then Exit Function

    If strict Then
        re.Pattern = "\s[-|:]\s"
        If re.Test(t) Then Exit Function
        re.Pattern = "[。！？!?]$"
        If re.Test(t) Then Exit Function
        re.Pattern = "\s{3,}"
        If re.Test(t) Then Exit Function
        If WordCount(t) > 6 Then Exit Function
    End If
    UsableLabel = True
End Function

Function CleanPrefix(current, candidate)
    Dim c, cur
    c = TrimEx(candidate & "")
    cur = TrimEx(current & "")
    CleanPrefix = False
    If c = "" Or cur = "" Then Exit Function
    If StrComp(c, cur, vbTextCompare) = 0 Then
        CleanPrefix = True
        Exit Function
    End If
    CleanPrefix = (InStr(1, c, cur & ".", vbTextCompare) = 1)
End Function

Function RemoveShortcutSuffix(name)
    Dim re
    Set re = New RegExp
    re.IgnoreCase = True
    re.Pattern = "\s*[-–—]\s*(快捷方式|shortcut)$"
    RemoveShortcutSuffix = TrimEx(re.Replace(name & "", ""))
End Function

' ------------------------------------------------------------
' 文件版本描述（Shell 属性，无需 .NET）
' ------------------------------------------------------------
Function FileDescription(path)
    Dim folder, file, value
    FileDescription = ""
    If TrimEx(path & "") = "" Then Exit Function
    If Not gFso.FileExists(path) Then Exit Function

    On Error Resume Next
    Set folder = gShellApp.NameSpace(gFso.GetParentFolderName(path))
    If Err.Number <> 0 Then
        Err.Clear
        Exit Function
    End If
    If folder Is Nothing Then Exit Function
    Set file = folder.ParseName(gFso.GetFileName(path))
    If Err.Number <> 0 Then
        Err.Clear
        Exit Function
    End If
    If file Is Nothing Then Exit Function

    value = file.ExtendedProperty("System.FileDescription")
    If Err.Number <> 0 Then
        Err.Clear
        value = ""
    End If
    If TrimEx(value & "") = "" Then
        value = file.ExtendedProperty("FileDescription")
        If Err.Number <> 0 Then
            Err.Clear
            value = ""
        End If
    End If
    On Error GoTo 0
    FileDescription = TrimEx(value & "")
End Function

' ------------------------------------------------------------
' 开始菜单索引与“应用列表”名称
' ------------------------------------------------------------
Sub CollectLnkFiles(folder, files)
    Dim f, subFolder
    On Error Resume Next
    For Each f In folder.Files
        If IsLnk(f.Name) Then
            files(LCase(f.Path)) = f.Path
        End If
    Next
    For Each subFolder In folder.SubFolders
        CollectLnkFiles subFolder, files
    Next
    On Error GoTo 0
End Sub

Sub BuildStartIndex(root, exactIndex, targetIndex)
    Dim files, path, info, exactKey, tk
    If TrimEx(root & "") = "" Then Exit Sub
    If Not gFso.FolderExists(root) Then Exit Sub

    Set files = CreateObject("Scripting.Dictionary")
    files.CompareMode = 1
    CollectLnkFiles gFso.GetFolder(root), files

    For Each path In files.Items
        Set info = ReadShortcut(path)
        If info.HasData And TrimEx(info.Target & "") <> "" Then
            exactKey = TargetKey(info.Target, info.Args, False)
            AddIndex exactIndex, exactKey, info.BaseName
            tk = TargetKey(info.Target, "", True)
            AddIndex targetIndex, tk, info.BaseName
        End If
    Next
End Sub

Function BuildStartAppNames()
    Dim dict, folder, items, item, id, nm
    Set dict = CreateObject("Scripting.Dictionary")
    dict.CompareMode = 1

    On Error Resume Next
    Set folder = gShellApp.NameSpace("shell:AppsFolder")
    If Err.Number <> 0 Then
        Err.Clear
        Set BuildStartAppNames = dict
        Exit Function
    End If
    If folder Is Nothing Then
        Set BuildStartAppNames = dict
        Exit Function
    End If
    Set items = folder.Items
    If Err.Number <> 0 Then
        Err.Clear
        Set BuildStartAppNames = dict
        Exit Function
    End If
    For Each item In items
        nm = TrimEx(item.Name & "")
        id = ""
        id = item.ExtendedProperty("System.AppUserModel.ID")
        If Err.Number <> 0 Then
            Err.Clear
            id = ""
        End If
        If TrimEx(id & "") = "" Then id = item.Path
        If nm <> "" And TrimEx(id & "") <> "" Then
            dict(LCase(TrimEx(id & ""))) = nm
        End If
        If nm <> "" And TrimEx(item.Path & "") <> "" Then
            dict(LCase(TrimEx(item.Path & ""))) = nm
        End If
    Next
    On Error GoTo 0
    Set BuildStartAppNames = dict
End Function

' ------------------------------------------------------------
' 原始名称判定
' ------------------------------------------------------------
Sub AddCandidate(list, name, source, rank)
    Dim c
    If TrimEx(name & "") = "" Then Exit Sub
    Set c = New Candidate
    c.Name = TrimEx(name & "")
    c.Source = source
    c.Rank = rank
    Set list(list.Count) = c
End Sub

Function GetOriginalName(info, exactIndex, targetIndex, appNames)
    Dim current, candidates, c, c2, key, list, names, name, appId
    Dim isShell, fileDesc, leaf, leafName, ext, clean, valid, best, bestLen
    Dim i, j

    current = SafeName(info.BaseName)
    Set candidates = CreateObject("Scripting.Dictionary")

    If info.HasData Then
        appId = ExtractAppId(info.Args)
        If appId <> "" And appNames.Exists(LCase(appId)) Then
            AddCandidate candidates, appNames(LCase(appId)), "应用列表", 0
        End If

        If TrimEx(info.Target & "") <> "" Then
            key = TargetKey(info.Target, info.Args, False)
            If exactIndex.Exists(key) Then
                Set list = exactIndex(key)
                names = list.Keys
                For i = 0 To UBound(names)
                    AddCandidate candidates, names(i), "开始菜单", 1
                Next
            End If
            If candidates.Count = 0 Then
                key = TargetKey(info.Target, "", True)
                If IndexCount(targetIndex, key) = 1 Then
                    AddCandidate candidates, IndexName(targetIndex, key, 0), "开始菜单", 2
                End If
            End If
        End If

        If UsableLabel(info.Desc, 32, True) Then
            AddCandidate candidates, info.Desc, "快捷方式描述", 3
        End If

        isShell = (InStr(1, info.Args & "", "shell:", vbTextCompare) > 0)
        If TrimEx(info.Target & "") <> "" And Not isShell Then
            If gFso.FileExists(info.Target) Then
                fileDesc = FileDescription(info.Target)
                If UsableLabel(fileDesc, 70, False) Then
                    AddCandidate candidates, fileDesc, "程序信息", 4
                End If
            End If

            leaf = gFso.GetFileName(info.Target)
            If leaf <> "" Then
                leafName = leaf
                ext = LCase(gFso.GetExtensionName(leaf))
                If ext = "exe" Or ext = "com" Or ext = "bat" Or ext = "cmd" Or ext = "msi" Then
                    leafName = gFso.GetBaseName(leaf)
                    If CleanPrefix(current, leafName) Then leafName = ""
                End If
                If leafName <> "" And UsableLabel(leafName, 80, False) Then
                    AddCandidate candidates, leafName, "目标文件名", 5
                End If
            End If
        End If
    End If

    If current <> "" Then
        clean = RemoveShortcutSuffix(current)
        If StrComp(clean, current, vbTextCompare) <> 0 And UsableLabel(clean, 80, False) Then
            AddCandidate candidates, clean, "去除后缀", 9
        End If
    End If

    Set valid = CreateObject("Scripting.Dictionary")
    For j = 0 To candidates.Count - 1
        Set c = candidates(j)
        name = SafeName(c.Name)
        If name <> "" Then
            Set c2 = New Candidate
            c2.Name = name
            c2.Source = c.Source
            c2.Rank = c.Rank
            Set valid(valid.Count) = c2
        End If
    Next

    If valid.Count = 0 Then
        If current <> "" Then
            Set c = New Candidate
            c.Name = current
            c.Source = "保留原名"
            c.Rank = 99
            Set GetOriginalName = c
        Else
            Set GetOriginalName = Nothing
        End If
        Exit Function
    End If

    If current <> "" Then
        For j = 0 To valid.Count - 1
            Set c = valid(j)
            If StrComp(c.Name, current, vbTextCompare) = 0 Then
                Set GetOriginalName = c
                Exit Function
            End If
        Next
    End If

    Set best = Nothing
    bestLen = 9999
    For j = 0 To valid.Count - 1
        Set c = valid(j)
        If best Is Nothing Then
            Set best = c
            bestLen = Len(c.Name)
        ElseIf c.Rank < best.Rank Or (c.Rank = best.Rank And Len(c.Name) < bestLen) Then
            Set best = c
            bestLen = Len(c.Name)
        End If
    Next
    Set GetOriginalName = best
End Function

' ------------------------------------------------------------
' 主流程
' ------------------------------------------------------------
Sub Main()
    Dim exactIndex, targetIndex, appNames, startRoots, desktopDirs
    Dim items, seen, i, j, dir, folder, file, info, existing, planned
    Dim plan, skipped, unchanged, original, desired, finalName, n
    Dim candidate, key, p, s, ok, fail, logLines, logPath, ts

    Set exactIndex = CreateObject("Scripting.Dictionary")
    exactIndex.CompareMode = 1
    Set targetIndex = CreateObject("Scripting.Dictionary")
    targetIndex.CompareMode = 1
    Set appNames = BuildStartAppNames()

    If gStartOverride <> "" Then
        startRoots = Array(gStartOverride)
    Else
        startRoots = Array(gShell.SpecialFolders("AllUsersStartMenu"), gShell.SpecialFolders("StartMenu"))
    End If
    For i = 0 To UBound(startRoots)
        BuildStartIndex startRoots(i), exactIndex, targetIndex
    Next

    If gTestDir <> "" Then
        desktopDirs = Array(gTestDir)
    Else
        desktopDirs = Array(gShell.SpecialFolders("Desktop"), gShell.SpecialFolders("AllUsersDesktop"))
    End If

    Set items = CreateObject("Scripting.Dictionary")
    Set seen = CreateObject("Scripting.Dictionary")
    seen.CompareMode = 1
    For i = 0 To UBound(desktopDirs)
        dir = TrimEx(desktopDirs(i))
        If dir <> "" And gFso.FolderExists(dir) Then
            If Not seen.Exists(LCase(dir)) Then
                seen(LCase(dir)) = True
                Set folder = gFso.GetFolder(dir)
                For Each file In folder.Files
                    If IsLnk(file.Name) Then
                        Set info = ReadShortcut(file.Path)
                        Set items(items.Count) = info
                    End If
                Next
            End If
        End If
    Next

    If items.Count = 0 Then
        WScript.StdOut.WriteLine "没有找到桌面快捷方式。"
        If gTestDir = "" Then Pause
        Exit Sub
    End If

    Set existing = CreateObject("Scripting.Dictionary")
    existing.CompareMode = 1
    For j = 0 To items.Count - 1
        Set info = items(j)
        existing(LCase(info.Path)) = True
    Next

    Set planned = CreateObject("Scripting.Dictionary")
    planned.CompareMode = 1
    Set plan = CreateObject("Scripting.Dictionary")
    Set skipped = CreateObject("Scripting.Dictionary")
    Set logLines = CreateObject("Scripting.Dictionary")
    unchanged = 0

    logLines(logLines.Count) = "时间：" & FormatDateTime(Now, vbGeneralDate)
    logLines(logLines.Count) = "桌面目录：" & Join(desktopDirs, " | ")

    WScript.StdOut.WriteLine ""
    WScript.StdOut.WriteLine "桌面快捷方式原始名称恢复"
    WScript.StdOut.WriteLine "============================================================"
    WScript.StdOut.WriteLine "桌面目录：" & Join(desktopDirs, "  |  ")
    WScript.StdOut.WriteLine "找到快捷方式：" & items.Count & " 个"

    For j = 0 To items.Count - 1
        Set info = items(j)
        Set original = GetOriginalName(info, exactIndex, targetIndex, appNames)
        If original Is Nothing Then
            skipped(skipped.Count) = info.BaseName
            logLines(logLines.Count) = "跳过：" & info.Path & " -> 无法解析原始名称"
        ElseIf StrComp(original.Name, info.BaseName, vbTextCompare) = 0 Then
            unchanged = unchanged + 1
            logLines(logLines.Count) = "不变：" & info.Path
        Else
            desired = original.Name
            finalName = desired
            n = 2
            Do
                candidate = gFso.BuildPath(info.Dir, finalName & ".lnk")
                key = LCase(candidate)
                If key = LCase(info.Path) Then Exit Do
                If Not existing.Exists(key) And Not planned.Exists(key) Then Exit Do
                finalName = desired & " (" & n & ")"
                n = n + 1
                If n > 100 Then Exit Do
            Loop

            If StrComp(finalName, info.BaseName, vbTextCompare) = 0 Then
                unchanged = unchanged + 1
                logLines(logLines.Count) = "不变：" & info.Path
            Else
                Set p = New PlanItem
                p.Path = info.Path
                p.Dir = info.Dir
                p.OldName = info.BaseName
                p.NewName = finalName
                p.Source = original.Source
                Set plan(plan.Count) = p
                planned(LCase(gFso.BuildPath(info.Dir, finalName & ".lnk"))) = True
                logLines(logLines.Count) = "计划：" & info.Path & " -> " & finalName & ".lnk（来源：" & original.Source & "）"
            End If
        End If
    Next

    If unchanged > 0 Then
        WScript.StdOut.WriteLine "已是原始名称：" & unchanged & " 个"
    End If
    If skipped.Count > 0 Then
        WScript.StdOut.WriteLine "无法确定原始名称：" & skipped.Count & " 个（保持原样）"
        For j = 0 To skipped.Count - 1
            s = skipped(j)
            WScript.StdOut.WriteLine "  - " & s
        Next
    End If

    If plan.Count = 0 Then
        WScript.StdOut.WriteLine ""
        WScript.StdOut.WriteLine "没有需要重命名的快捷方式。"
        logLines(logLines.Count) = "结果：没有需要重命名的快捷方式。"
    Else
        WScript.StdOut.WriteLine ""
        WScript.StdOut.WriteLine "准备重命名 " & plan.Count & " 个快捷方式："
        For j = 0 To plan.Count - 1
            Set p = plan(j)
            WScript.StdOut.WriteLine "  [" & p.Source & "] " & p.OldName & "  ->  " & p.NewName
        Next
        If Not gAutoYes Then
            WaitEnter "按回车开始重命名（按 Ctrl+C 取消）..."
        End If

        ok = 0
        fail = 0
        For j = 0 To plan.Count - 1
            Set p = plan(j)
            On Error Resume Next
            gFso.MoveFile p.Path, gFso.BuildPath(p.Dir, p.NewName & ".lnk")
            If Err.Number = 0 Then
                ok = ok + 1
                WScript.StdOut.WriteLine "  [成功] " & p.OldName & "  ->  " & p.NewName
                logLines(logLines.Count) = "成功：" & p.Path & " -> " & p.NewName & ".lnk"
            Else
                fail = fail + 1
                WScript.StdOut.WriteLine "  [失败] " & p.OldName & "：" & Err.Description
                logLines(logLines.Count) = "失败：" & p.Path & " -> " & p.NewName & ".lnk；" & Err.Description
                Err.Clear
            End If
            On Error GoTo 0
        Next

        WScript.StdOut.WriteLine ""
        WScript.StdOut.WriteLine "完成：成功 " & ok & " 个，失败 " & fail & " 个，未变 " & unchanged & " 个，跳过 " & skipped.Count & " 个。"
        logLines(logLines.Count) = "结果：完成：成功 " & ok & " 个，失败 " & fail & " 个，未变 " & unchanged & " 个，跳过 " & skipped.Count & " 个。"
    End If

    ts = Year(Now) & Right("0" & Month(Now), 2) & Right("0" & Day(Now), 2) & "_" & _
         Right("0" & Hour(Now), 2) & Right("0" & Minute(Now), 2) & Right("0" & Second(Now), 2)
    logPath = gFso.BuildPath(gShell.ExpandEnvironmentStrings("%TEMP%"), "DesktopShortcutRename_" & ts & ".log")
    On Error Resume Next
    Dim logFile
    Set logFile = gFso.CreateTextFile(logPath, True, True)
    If Err.Number = 0 Then
        For j = 0 To logLines.Count - 1
            logFile.WriteLine logLines(j)
        Next
        logFile.Close
        WScript.StdOut.WriteLine "日志：" & logPath
    Else
        WScript.StdOut.WriteLine "日志写入失败：" & Err.Description
        Err.Clear
    End If
    On Error GoTo 0

    If gTestDir = "" Then Pause
End Sub
]]>
</script>
</job>
```


## ❓ 常见问题

**Q：运行后提示需要管理员权限怎么办？**
A：关闭窗口，右键脚本选择「以管理员身份运行」，或在弹出的 UAC 提示中点击“是”。

**Q：为什么有些快捷方式没有被改名？**
A：脚本可能无法从开始菜单、描述、版本信息或文件名中推断出可靠名称，此时会主动跳过并保持原样，避免误改。

**Q：重命名后想还原怎么办？**
A：脚本只改名称、不改内容，可以手动改回；日志中记录了每一条旧名称与新名称，方便对照。

**Q：可以处理开始菜单里的快捷方式吗？**
A：当前版本只处理桌面（当前用户 + 公共桌面），开始菜单仅作为名称还原的参考索引，不会被修改。

---

> 本文档由个人文档中心收录，脚本与资源统一存放在 `dist/docs/resources/`，可在页面顶部「🧰 资源下载」区域直接下载。
