Add-Type -AssemblyName System.Drawing
$imagePath = "c:\Teravolta website dev\Development\public\images\brand\textura.png"
$img = [System.Drawing.Image]::FromFile($imagePath)
Write-Output "Width: $($img.Width)"
Write-Output "Height: $($img.Height)"
$img.Dispose()
