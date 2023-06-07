import React, { createContext, useState } from 'react'
export const registerContext = createContext();
export const deleteContext = createContext()
export const editContext = createContext()

function ContextShare({children}) {
    //register data state
    const [registerData,setregisterData] = useState("")
    //delete data state
    const [deleteData,setdeleteData] = useState("")
    //edit data state
    const [editdata,seteditdata] = useState("")
  return (
    <>

       <registerContext.Provider value={{registerData,setregisterData}}>
            <editContext.Provider value={{editdata,seteditdata}}>
              <deleteContext.Provider value={{deleteData,setdeleteData}}>
                {children}
              </deleteContext.Provider>
            </editContext.Provider>
       </registerContext.Provider>

    </>
  )
}

export default ContextShare