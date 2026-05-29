MySQL.ready(function()
    MySQL.query([[
        CREATE TABLE IF NOT EXISTS `krs_phone_users` (
          `phone_number` varchar(50) NOT NULL,
          `identifier` varchar(100) NOT NULL,
          `firstname` varchar(50) DEFAULT 'Unknown',
          `lastname` varchar(50) DEFAULT 'Player',
          `wallpaper` varchar(255) DEFAULT NULL,
          `settings` longtext DEFAULT NULL, 
          PRIMARY KEY (`phone_number`),
          KEY `identifier` (`identifier`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    ]])
    print("[krs_phone] Database tables checked/created.")
end)

local NumberToSource = {}

local function formatPhoneNumber(rawNumber)
    if not rawNumber or #rawNumber ~= 9 then return rawNumber end
    return string.format("(%s) %s-%s", rawNumber:sub(1, 3), rawNumber:sub(4, 6), rawNumber:sub(7, 9))
end

local function generatePhoneNumber()
    local prefix = Config.PhoneNumber.Prefixes[math.random(1, #Config.PhoneNumber.Prefixes)]
    local number
    repeat
        local suffix = ""
        for i = 1, Config.PhoneNumber.Length do
            suffix = suffix .. tostring(math.random(0, 9))
        end
        number = prefix .. suffix
        local exists = MySQL.scalar.await("SELECT 1 FROM krs_phone_users WHERE phone_number = ?", { number })
    until not exists
    return number
end

local function getPlayerNumber(src)
    local items = exports.ox_inventory:Search(src, 'slots', 'phone')
    if not items or not items[1] then return nil end

    local item = items[1]
    if not item.metadata then return nil end

    return item.metadata.phoneNumber
end

local function getSourceFromNumber(number)
    local clean = number:gsub("[%s%(%)%-]", "")
    return NumberToSource[clean]
end

lib.callback.register('krs_phone:setupPhone', function(source)
    local Player = Framework.GetPlayer(source)
    if not Player then return nil end

    local identifier = Framework.GetIdentifier(Player)
    local firstname, lastname, fullName = Framework.GetCharacterName(Player)

    local items = exports.ox_inventory:Search(source, 'slots', 'phone')
    local item = items and items[1]
    if not item then return nil end

    local result = MySQL.single.await(
        "SELECT * FROM krs_phone_users WHERE identifier = ?",
        { identifier }
    )

    if result then
        local phoneNumber = tostring(result.phone_number)
        NumberToSource[phoneNumber] = source

        if not item.metadata or item.metadata.phoneNumber ~= phoneNumber then
            exports.ox_inventory:SetMetadata(source, item.slot, {
                phoneNumber = phoneNumber,
                ownerName = fullName,
                description = "Number: " .. formatPhoneNumber(phoneNumber)
            })
        end

        return {
            number = formatPhoneNumber(phoneNumber),
            rawNumber = phoneNumber,
            playerName = fullName 
        }
    end

    local rawNumber = generatePhoneNumber()
    local formatted = formatPhoneNumber(rawNumber)

    exports.ox_inventory:SetMetadata(source, item.slot, {
        phoneNumber = rawNumber,
        ownerName = fullName,
        description = "Number: " .. formatted
    })

    MySQL.insert.await([[
        INSERT INTO krs_phone_users 
        (phone_number, identifier, firstname, lastname) 
        VALUES (?, ?, ?, ?)
    ]], {
        rawNumber, identifier, firstname, lastname
    })

    NumberToSource[rawNumber] = source

    return { 
        number = formatted, 
        rawNumber = rawNumber,
        playerName = fullName 
    }
end)

RegisterNetEvent('krs_phone:server:setWallpaper', function(url)
    local src = source
    local Player = Framework.GetPlayer(src)
    if not Player then return end
    
    local identifier = Framework.GetIdentifier(Player)
    MySQL.update('UPDATE krs_phone_users SET wallpaper = ? WHERE identifier = ?', { url, identifier })
end)

RegisterNetEvent('krs_phone:server:getWallpaper', function()
    local src = source
    local Player = Framework.GetPlayer(src)
    if not Player then return end
    
    local identifier = Framework.GetIdentifier(Player)
    local wallpaper = MySQL.scalar.await('SELECT wallpaper FROM krs_phone_users WHERE identifier = ?', { identifier })
    
    if wallpaper and wallpaper ~= "" then
        TriggerClientEvent('krs_phone:client:loadWallpaper', src, wallpaper)
    else
        TriggerClientEvent('krs_phone:client:loadWallpaper', src, "nui://krs_phone/web/images/wallpaper/default.png")
    end
end)

RegisterNetEvent('krs_phone:server:saveSettings', function(settingsData)
    local src = source
    local Player = Framework.GetPlayer(src)
    if not Player then return end
    
    local identifier = Framework.GetIdentifier(Player)
    MySQL.update('UPDATE krs_phone_users SET settings = ? WHERE identifier = ?', { json.encode(settingsData), identifier })
end)

RegisterNetEvent('krs_phone:server:getSettings', function()
    local src = source
    local Player = Framework.GetPlayer(src)
    if not Player then return end
    
    local identifier = Framework.GetIdentifier(Player)
    local settingsStr = MySQL.scalar.await('SELECT settings FROM krs_phone_users WHERE identifier = ?', { identifier })
    
    if settingsStr and settingsStr ~= "" then
        local settings = json.decode(settingsStr)
        TriggerClientEvent('krs_phone:client:loadSettings', src, settings)
    else
        local defaultSettings = { 
            darkmode = true, 
            flightmode = false,
            volume = 0.6,
            brightness = 1.0,
            hasBooted = false 
        }
        TriggerClientEvent('krs_phone:client:loadSettings', src, defaultSettings)
    end
end)