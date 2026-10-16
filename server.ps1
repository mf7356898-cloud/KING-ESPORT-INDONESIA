$port = 8080
$folder = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "KING ESPORT Server aktif di http://localhost:$port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        [System.Threading.ThreadPool]::QueueUserWorkItem({
            param($ctx)
            $req = $ctx.Request
            $res = $ctx.Response

            try {
                $rawPath = $req.Url.LocalPath.TrimStart('/')
                if ([string]::IsNullOrWhiteSpace($rawPath)) {
                    $rawPath = "index.html"
                }

                $cleanPath = $rawPath -replace '/', '\'
                $targetFile = Join-Path $folder $cleanPath

                if (Test-Path $targetFile -PathType Leaf) {
                    $bytes = [System.IO.File]::ReadAllBytes($targetFile)
                    $ext = [System.IO.Path]::GetExtension($targetFile).ToLower()
                    $mime = switch ($ext) {
                        ".html" { "text/html; charset=utf-8" }
                        ".css"  { "text/css; charset=utf-8" }
                        ".js"   { "application/javascript; charset=utf-8" }
                        ".svg"  { "image/svg+xml" }
                        ".png"  { "image/png" }
                        ".jpg"  { "image/jpeg" }
                        ".json" { "application/json" }
                        default { "application/octet-stream" }
                    }

                    $res.ContentType = $mime
                    $res.ContentLength64 = $bytes.Length

                    if ($req.HttpMethod -ne 'HEAD') {
                        $res.OutputStream.Write($bytes, 0, $bytes.Length)
                    }
                } else {
                    $res.StatusCode = 404
                    $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    $res.ContentType = "text/plain; charset=utf-8"
                    $res.ContentLength64 = $notFound.Length
                    if ($req.HttpMethod -ne 'HEAD') {
                        $res.OutputStream.Write($notFound, 0, $notFound.Length)
                    }
                }
            } catch {
                # ignore transient client disconnects
            } finally {
                try { $res.Close() } catch {}
            }
        }, $context) | Out-Null
    }
} finally {
    try { $listener.Stop() } catch {}
}
