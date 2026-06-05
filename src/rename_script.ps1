$baseDir = "C:\Users\hb\OneDrive\Desktop\FNRC\src\app"

# 1. Rename files
$filesToRename = @(
    @{ Old = "pages\admin\AdminRFPCreate.tsx"; New = "AdminTenderCreate.tsx" }
    @{ Old = "pages\admin\AdminRFPDetail.tsx"; New = "AdminTenderDetail.tsx" }
    @{ Old = "pages\admin\AdminRFPManagement.tsx"; New = "AdminTenderManagement.tsx" }
    @{ Old = "pages\vendor\VendorRFPDetail.tsx"; New = "VendorTenderDetail.tsx" }
    @{ Old = "pages\vendor\VendorRFPList.tsx"; New = "VendorTenderList.tsx" }
)

foreach ($f in $filesToRename) {
    $oldPath = Join-Path $baseDir $f.Old
    if (Test-Path $oldPath) {
        Rename-Item -Path $oldPath -NewName $f.New
        Write-Host "Renamed $($f.Old) to $($f.New)"
    }
}

# 2. Replace text in all files
$files = Get-ChildItem -Path $baseDir -Recurse -Include *.tsx,*.ts -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Specific targeted replacements first to prevent case issues
    $content = $content -creplace "mockRFPs", "mockTenders"
    $content = $content -creplace "activeRFPs", "activeTenders"
    $content = $content -creplace "filteredRFPs", "filteredTenders"
    $content = $content -creplace "paginatedRFPs", "paginatedTenders"
    $content = $content -creplace "recentRFPs", "recentTenders"
    $content = $content -creplace "RFP-", "TEND-"
    
    # Then generic replacements
    $content = $content -creplace "RFPs", "Tenders"
    $content = $content -creplace "rfps", "tenders"
    $content = $content -creplace "RFP", "Tender"
    $content = $content -creplace "rfp", "tender"
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated text in $($file.Name)"
    }
}
Write-Host "Done!"
