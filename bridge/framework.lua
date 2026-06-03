Framework = {}
QBCore, ESX = nil, nil
Config = Config or {}

if GetResourceState("qbx_core") == "started" then
    Config.Framework = "Qbox"
elseif GetResourceState("qb-core") == "started" then
    QBCore = exports['qb-core']:GetCoreObject()
    Config.Framework = "QBCore"
elseif GetResourceState("es_extended") == "started" then
    ESX = exports["es_extended"]:getSharedObject()
    Config.Framework = "ESX"
else
    Config.Framework = "none"
end

print("[krs_phone] Framework detected and started: " .. Config.Framework)

if not IsDuplicityVersion() then
    -- ================= CLIENT SIDE =================
    Framework.PlayerLoggedIn = false

    function Framework.GetPlayerData()
        if Config.Framework == "QBCore" then
            return QBCore.Functions.GetPlayerData()
        elseif Config.Framework == "Qbox" then
            return exports.qbx_core:GetPlayerData()
        elseif Config.Framework == "ESX" then
            return ESX.GetPlayerData()
        end
        return nil
    end

    function Framework.GetJob()
        local player = Framework.GetPlayerData()
        if not player or not player.job then return nil end

        if Config.Framework == "QBCore" or Config.Framework == "Qbox" then
            return { name = player.job.name, level = player.job.grade.level }
        elseif Config.Framework == "ESX" then
            return { name = player.job.name, level = player.job.grade }
        end
        return nil
    end

    function Framework.GetGang()
        local player = Framework.GetPlayerData()
        if not player or not player.gang then return nil end

        if Config.Framework == "QBCore" or Config.Framework == "Qbox" then
            return { name = player.gang.name, level = player.gang.grade.level }
        elseif Config.Framework == "ESX" then
            return nil 
        end
        return nil
    end

    function Framework.PlayerLoginListeners()
        if Config.Framework == "QBCore" then
            RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
                Framework.PlayerLoggedIn = true
            end)

            RegisterNetEvent("QBCore:Client:OnPlayerUnload", function()
                Framework.PlayerLoggedIn = false
            end)

        elseif Config.Framework == "Qbox" then
            AddStateBagChangeHandler("isLoggedIn", ("player:%s"):format(cache.serverId), function(_, _, loggedIn)
                Framework.PlayerLoggedIn = loggedIn
            end)

        elseif Config.Framework == "ESX" then
            
            local function AwaitESXPlayer()
                CreateThread(function()
                    local timer = 0
                    while not Framework.GetPlayerData() or PlayerPedId() == 0 do
                        Wait(100)
                        timer = timer + 100
                        if timer >= 30000 then
                            print("[krs_phone] ERROR: Ped has not loaded or GetPlayerData returned false (waited 30 seconds)")
                            return
                        end
                    end
                    Framework.PlayerLoggedIn = true
                end)
            end

            RegisterNetEvent("esx:playerLoaded", function()
                AwaitESXPlayer()
            end)

            RegisterNetEvent("esx:onPlayerSpawn", function()
                AwaitESXPlayer()
            end)

            RegisterNetEvent("esx:onPlayerLogout", function()
                Framework.PlayerLoggedIn = false
            end)

        else
            CreateThread(function()
                local timer = 0
                while PlayerPedId() == 0 do
                    Wait(100)
                    timer = timer + 100
                    if timer >= 500000 then
                        print("[krs_phone] ERROR: [Standalone] Ped never loaded in; could not login (waited 500 seconds)")
                        return
                    end
                end
                Framework.PlayerLoggedIn = true
            end)
        end
    end

    CreateThread(function()
        Framework.PlayerLoginListeners()
    end)

    AddEventHandler('onResourceStart', function(resourceName)
        if GetCurrentResourceName() ~= resourceName then return end
        
        Wait(1000) 
        
        if Config.Framework == "QBCore" then
            local PlayerData = QBCore.Functions.GetPlayerData()
            if PlayerData and next(PlayerData) then 
                Framework.PlayerLoggedIn = true 
            end
        elseif Config.Framework == "Qbox" then
            if LocalPlayer.state.isLoggedIn then 
                Framework.PlayerLoggedIn = true 
            end
        elseif Config.Framework == "ESX" then
            if ESX.IsPlayerLoaded() then 
                Framework.PlayerLoggedIn = true 
            end
        else
            if PlayerPedId() > 0 then 
                Framework.PlayerLoggedIn = true 
            end
        end
    end)

else
    -- ================= SERVER SIDE =================
    function Framework.GetPlayer(source)
        if Config.Framework == "QBCore" then
            return QBCore.Functions.GetPlayer(source)
        elseif Config.Framework == "Qbox" then
            return exports.qbx_core:GetPlayer(source)
        elseif Config.Framework == "ESX" then
            return ESX.GetPlayerFromId(source)
        end
        return nil
    end

    function Framework.GetJob(source)
        local player = Framework.GetPlayer(source)
        if not player then return nil end

        if Config.Framework == "QBCore" or Config.Framework == "Qbox" then
            return { name = player.PlayerData.job.name, level = player.PlayerData.job.grade.level }
        elseif Config.Framework == "ESX" then
            return { name = player.job.name, level = player.job.grade }
        end
        return nil
    end

    function Framework.GetGang(source)
        local player = Framework.GetPlayer(source)
        if not player then return nil end

        if Config.Framework == "QBCore" or Config.Framework == "Qbox" then
            if player.PlayerData.gang then
                return { name = player.PlayerData.gang.name, level = player.PlayerData.gang.grade.level }
            end
        elseif Config.Framework == "ESX" then
            return nil
        end
        return nil
    end

    function Framework.GetIdentifier(player)
        if not player then return nil end
        if Config.Framework == "QBCore" or Config.Framework == "Qbox" then
            return player.PlayerData.citizenid
        elseif Config.Framework == "ESX" then
            return player.identifier
        end
        return nil
    end

    function Framework.GetCharacterName(player)
        if not player then return "Unknown", "Player", "Unknown Player" end
        
        if Config.Framework == "QBCore" or Config.Framework == "Qbox" then
            local charinfo = player.PlayerData.charinfo
            return charinfo.firstname, charinfo.lastname, charinfo.firstname .. " " .. charinfo.lastname
        elseif Config.Framework == "ESX" then
            local firstname = player.get('firstName') or "Unknown"
            local lastname = player.get('lastName') or "Player"
            if firstname == "Unknown" and player.name then
                return player.name, "", player.name 
            end
            return firstname, lastname, firstname .. " " .. lastname
        end
        return "Unknown", "Player", "Unknown Player"
    end
end
