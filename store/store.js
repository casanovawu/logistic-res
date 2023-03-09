
import {action, observable} from 'mobx-miniprogram'

export const store = observable({
    tarbarList:[],
    // actions 方式，用来修改store中的数据
    updateTarbarList:action(function(tarbarList){
        this.tarbarList=tarbarList
    }),

})
