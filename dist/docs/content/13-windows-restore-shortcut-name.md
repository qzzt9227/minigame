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
- **纯系统组件实现**：批处理负责提权与启动，核心逻辑使用 Windows 自带的 PowerShell，不需要安装任何第三方工具。

## 📥 一键下载脚本

:::download
file=resources/Restore-shortcut-to-its-original-name.cmd
title=Restore-shortcut-to-its-original-name.cmd
desc=Windows 10 / 11 桌面快捷方式名称恢复脚本，需以管理员身份运行。
badge=CMD
size=15.9 KB
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
- 重命名采用 Windows 原生 `Rename-Item`，不会删除文件；遇到重名会自动编号。
- 如果某个快捷方式无法推断出可靠名称，脚本会保持原样并记录为“跳过”，不会强行改名。
- 日志默认保存在 `%TEMP%` 目录，文件名形如 `DesktopShortcutRename_20261031_180000.log`。
- 企业环境或受控电脑上，请先确认有修改桌面文件的权限，并遵循所在组织的安全规范。

## 🧠 名称还原优先级

| 优先级 | 名称来源 | 说明 |
| --- | --- | --- |
| 0 | 应用列表 | 解析 `shell:AppsFolder` 启动参数，匹配 `Get-StartApps` 中的应用显示名 |
| 1 | 开始菜单 | 目标路径与启动参数完全一致的开始菜单快捷方式名称 |
| 2 | 开始菜单 | 仅目标路径一致、且只匹配到一个开始菜单项时采用 |
| 3 | 快捷方式描述 | 快捷方式属性中的“备注/描述”，做严格可用性校验 |
| 4 | 程序信息 | 目标程序的 `FileDescription` 版本信息 |
| 5 | 目标文件名 | 目标程序文件名（对 `.exe` 等去掉扩展名） |
| 9 | 去除后缀 | 当前名称去掉“ - 快捷方式 / - shortcut”等后缀 |
| 99 | 保留原名 | 以上都无法推断时，保持当前名称不变 |

## 💻 完整脚本代码

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
