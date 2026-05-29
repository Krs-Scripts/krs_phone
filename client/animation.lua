phoneProp = 0 

local phoneModel = `prop_amb_phone`

PhoneData = PhoneData or {
    AnimationData = {
        lib = nil,
        anim = nil
    },
    CallData = { 
        InCall = false 
    }
}

local function LoadAnimation(dict)
    local success = lib.requestAnimDict(dict, 10000)
    if not success then
        lib.print.error("Animation dictionary not loaded:", dict)
        return false
    end
    return true
end

local function CheckAnimLoop()
    CreateThread(function()
        while PhoneData.AnimationData.lib and PhoneData.AnimationData.anim do
            local ped = cache.ped
            if not IsEntityPlayingAnim(ped, PhoneData.AnimationData.lib, PhoneData.AnimationData.anim, 3) then
                if LoadAnimation(PhoneData.AnimationData.lib) then
                    TaskPlayAnim(ped, PhoneData.AnimationData.lib, PhoneData.AnimationData.anim, 3.0, 3.0, -1, 50, 0, false, false, false)
                end
            end
            Wait(500)
        end
    end)
end

function newPhoneProp()
    deletePhone()

    local success = lib.requestModel(phoneModel, 10000)
    if not success then
        lib.print.error("Phone model not loaded:", phoneModel)
        return
    end

    phoneProp = CreateObject(phoneModel, 1.0, 1.0, 1.0, true, true, false)
    local bone = GetPedBoneIndex(cache.ped, 28422)

    if phoneModel == `prop_cs_phone_01` then
        AttachEntityToEntity(phoneProp, cache.ped, bone, 0.0, 0.0, 0.0, 50.0, 320.0, 50.0, 1, 1, 0, 0, 2, 1)
    else
        AttachEntityToEntity(phoneProp, cache.ped, bone, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1, 1, 0, 0, 2, 1)
    end
end


function deletePhone()
    if phoneProp ~= 0 then
        DeleteEntity(phoneProp)
        phoneProp = 0
    end
end

function StopPhoneAnimation()
    if PhoneData.AnimationData.lib and PhoneData.AnimationData.anim then
        StopAnimTask(cache.ped, PhoneData.AnimationData.lib, PhoneData.AnimationData.anim, 1.0)
        PhoneData.AnimationData.lib = nil
        PhoneData.AnimationData.anim = nil
        deletePhone() 
    end
end

function DoPhoneAnimation(anim)
    local animLib = 'cellphone@'
    
    if IsPedInAnyVehicle(cache.ped, false) then
        animLib = 'anim@cellphone@in_car@ps'
    end

    local success = LoadAnimation(animLib)
    if not success then return end

    if phoneProp == 0 then
        newPhoneProp()
    end

    TaskPlayAnim(cache.ped, animLib, anim, 3.0, 3.0, -1, 50, 0, false, false, false)

    PhoneData.AnimationData.lib = animLib
    PhoneData.AnimationData.anim = anim

    CheckAnimLoop()
end