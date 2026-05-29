PhoneData = { 
    AnimationData = { lib = nil, anim = nil },
    wallpaperHome = nil,
    settings = {
        darkmode = true,
        flightmode = false,
        ringtone = "Default",
        volume = 0.6,      
        brightness = 1.0,
        hasBooted = false 
    }
}

local phoneOpen = false
local controlThread = nil

function SendReactMessage(action, data)
    SendNUIMessage({
        action = action,
        data = data
    })
end

RegisterNUICallback("Phone", function(data, cb)
    local action = data.action

    if action == "setupPhone" then
        lib.callback('krs_phone:setupPhone', false, cb)
    end
    -- We will add the other functions (calls, contacts, messages, ecc)
    -- in here as we build apps in React!
end)

RegisterNUICallback('save-settings', function(data, cb)
    if data then
        for key, value in pairs(data) do
            PhoneData.settings[key] = value
        end
        TriggerServerEvent('krs_phone:server:saveSettings', PhoneData.settings)
    end
    cb({})
end)

RegisterNetEvent('krs_phone:client:loadSettings', function(settings)
    if not settings then return end
    for key, value in pairs(settings) do
        PhoneData.settings[key] = value
    end
    SendReactMessage('setSettings', PhoneData.settings)
end)

RegisterNUICallback('get-settings', function(_, cb)
    cb(PhoneData.settings)
end)

RegisterNUICallback('set-wallpaper', function(data, cb)
    TriggerServerEvent('krs_phone:server:setWallpaper', data.url)
    cb({})
end)

RegisterNUICallback('hide-ui', function(_, cb)
    openPhone(false)
    StopPhoneAnimation()
    cb({})
end)

RegisterNetEvent('krs_phone:client:loadWallpaper', function(url)
    PhoneData.wallpaperHome = url
    SendReactMessage('setWallpaper', url)
end)

local function DisableDisplayControlActions()
    -- MOUSE LOOK / CAMERA
    DisableControlAction(0, 1, true)   -- Mouse X
    DisableControlAction(0, 2, true)   -- Mouse Y
    DisableControlAction(0, 3, true)   -- Look Left/Right
    DisableControlAction(0, 4, true)   -- Look Up/Down
    DisableControlAction(0, 5, true)   -- Look Up/Down (alternative)
    DisableControlAction(0, 6, true)   -- Look Left/Right (alternative)
    DisableControlAction(0, 30, true)  -- Move Left/Right (A/D)
    DisableControlAction(0, 31, true)  -- Move Forward/Back (W/S)
    DisableControlAction(0, 21, true)  -- Sprint
    DisableControlAction(0, 22, true)  -- Jump

    -- COMBAT / MELEE
    DisableControlAction(0, 263, true) -- Melee attack
    DisableControlAction(0, 264, true) -- Melee attack heavy
    DisableControlAction(0, 257, true) -- Attack
    DisableControlAction(0, 140, true) -- Melee light attack
    DisableControlAction(0, 141, true) -- Melee heavy attack
    DisableControlAction(0, 142, true) -- Melee alternative
    DisableControlAction(0, 143, true) -- Melee block

    -- MENU / ESC
    DisableControlAction(0, 177, true) -- BACKSPACE

    -- CHAT
    DisableControlAction(0, 245, true) -- Open chat (T)
end

local function startControlThread()
    if controlThread then return end

    controlThread = CreateThread(function()
        while phoneOpen do
            DisableDisplayControlActions()
            Wait(200)
        end
        controlThread = nil
    end)
end

function openPhone(state)
    phoneOpen = state
    if state then
        lib.callback('krs_phone:setupPhone', false, function(data)
            if not data then return end

            SendReactMessage("setPhoneData", data)
            SendReactMessage("setMyNumber", data.number)

            SetNuiFocus(true, true)
            SendReactMessage('setVisible', true)

            TriggerServerEvent('krs_phone:server:getWallpaper')
            TriggerServerEvent('krs_phone:server:getSettings') 

            newPhoneProp()
            DoPhoneAnimation("cellphone_text_in")
            startControlThread()
        end)
    else
        SetNuiFocus(false, false)
        SendReactMessage('setVisible', false)
        DoPhoneAnimation("cellphone_text_out")
        SetTimeout(250, function()
            StopPhoneAnimation()
            DestroyMobilePhone()
            CellCamActivate(false, false)
            deletePhone()
        end)
    end
end

local function canOpenPhone()
    if not Framework.PlayerLoggedIn then return false end 
    if LocalPlayer.state.invOpen then return false end
    if IsPauseMenuActive() then return false end
    if IsScreenFadedOut() then return false end
    if IsEntityDead(cache.ped) then return false end
    return true
end

lib.addKeybind({
    name = 'open_phone',
    description = 'Open Krs Phone',
    defaultKey = 'F1',
    onPressed = function()
        if not canOpenPhone() then return end
        openPhone(true)
    end
})