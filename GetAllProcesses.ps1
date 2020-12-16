# $PROCESSS_PATH = 'D:\Project\Poweshell Project\Atlas\NewFolder\allprocess.txt'
# $SERVICE_PATH = 'D:\Project\Poweshell Project\Atlas\NewFolder\allservice.txt'

# #Write all process into a file
# Get-Process | Out-File -filepath $PROCESSS_PATH

# #Write all services into a file
# Get-Service | Out-File -filepath $SERVICE_PATH

function SpaceBuilder($totalSpace) {
    $space = ''
    for($i = 0; $i -lt $totalSpace; $i++) {
        $space = $space + ' '
    }
    return $space
}

function AdvSplit($inputLine) {
    $space_length = 1
    $begin_space = $false
    $space_index = @()
    $inputarray = $inputLine.ToCharArray()
    $count = 0
    foreach($character in $inputarray) {
        if($character -eq ' ') {
            #Detecting the first space
            if(!$begin_space) {
                $begin_space = $true
            }
            else {
                $space_length = $space_length + 1
            }
        }
        elseif ($character -ne ' ') {
            if($begin_space) {
                $space_index = $space_index + $space_length
                $space_length = 0
            }
            $begin_space = $false
        }
        
        $count = $count + 1
        if ($inputarray.Length -eq $count) {
            if($begin_space) {
                $space_length = $space_length + 1
                $space_index = $space_index + $space_length
                $space_length = 0
            }
        }
    }

    #Replace space
    #Get the first space
    $space_string = @()
    $space_string = $space_string + ( SpaceBuilder($space_index[0]) )
    $space_string = $space_string + ( SpaceBuilder($space_index[1]) )
    $space_string = $space_string + ( SpaceBuilder($space_index[$space_index.Length - 1]) )
    
    # Better way to do all of this
    $resu=""
    gps | foreach { $resu+=("PM(K)= {0},appName={1};" -f ($_.pm/1KB),$_.name) }
    $resu
}

$sample = 'Stopped  AJRouter           AllJoyn Router Service                '
AdvSplit($sample)

# Write-Host("`n`nList of all process:`n")
# $count = 0
# foreach($line in Get-Content $PROCESSS_PATH) {
#     #Write-Host("current count is $count")
#     if($count -ne 0 -And $count-ne 1 -And $count-ne 2) {
#         $cleanline = (($line.trim() -replace 'Get-Service\s \s',' ') -replace '\s \s',' ') -replace '\s ',' '
#         $splitresult = $cleanline.Split(" ")
#         $splitresult[7]
#     }
#     $count = $count + 1
# }

# Write-Host("`n`nList of all services:`n")
# $count = 0
# foreach($line in Get-Content $SERVICE_PATH) {
#     #Write-Host("current count is $count")
#     if($count -ne 0 -And $count-ne 1 -And $count-ne 2) {
#         $cleanline = (($line.trim() -replace '\s \s',' ') -replace '\s \s',' ') -replace '\s ',' '
#         $splitresult = $cleanline.Split(' ')
#         $splitresult
#     }
#     $count = $count + 1
# }