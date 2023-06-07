import React, { useEffect, useState,useContext } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import HomeTable from '../Components/HomeTable'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../Components/LoadingSpinner'
import {deleteContext, editContext, registerContext} from '../Components/ContextShare'
import { getusersapi, removeUser } from '../services/allApis'


function Home() {

        //get edit context using useContext
        const {editdata,seteditdata} = useContext(editContext)

    //get delete context using useContext
    const {deleteData,setdeleteData} = useContext(deleteContext)

    //state to hold search data
    const [searchKey,setsearchKey] = useState("")
    // console.log(searchKey);

    //state to hold all users
    const [allusers,setallusers] = useState([])

    //define delete user
    const deleteUser = async (id) =>{
        console.log('Inside delete function:' +id);
        //make api call to services
        const res = await removeUser(id)
        console.log(res);
        if(res.status===200){
            //data successfully removed
            //pass response data to context
            setdeleteData(res.data)
            //call users api
            getusersDetails()
        }
        else{
            console.log("Error");
        }
    }

    //define a function to call getallusers api
    const getusersDetails = async () =>{
        const serverResponse = await getusersapi(searchKey)
        // console.log(serverResponse);
        setallusers(serverResponse.data)
    }

    // console.log(allusers);

    //get register context using useContext
    const {registerData,setregisterData} = useContext(registerContext)


    //create state to display spinner
    const [showSpin, setShowSpin] = useState(true)

    //navigate to another page-useNavigate
    const navigate = useNavigate()

    //to redirect to register page when add btn clicked
    const addUser = () => {
        //navigate to register
        navigate('/register')
    }

    useEffect(()=>{
        //call getusers api
        getusersDetails()
        //set showspin as false after 2 seconds
        setTimeout(() => {
            setShowSpin(false)
        }, 2000);
    },[searchKey])

    return (
        <>
          {
            registerData?<Alert className='bg-success' variant='success' onClose={()=> setregisterData("")} dismissible> {registerData.fname.toUpperCase()} Successfully Registered </Alert>  :""
          }
          {
            editdata?<Alert className='bg-success' variant='success' onClose={()=> seteditdata("")} dismissible> {editdata.fname.toUpperCase()} Successfully updated!!! </Alert>  :""
          }
          {
            deleteData?<Alert className='bg-danger' variant='danger' onClose={()=> setdeleteData("")} dismissible> {deleteData.fname.toUpperCase()} Successfully deleted!!! </Alert>  :""
          }
            <div className='container mt-5'>
                <div className="first_div">
                    {/* search add btn */}
                    <div className="search_add d-flex justify-content-between">
                        {/* search */}
                        <div className="search col-md-4">
                            <Form className='d-flex'>
                                <Form.Control
                                    type="text"
                                    placeholder="Search Employee name here"
                                    onChange={e=>setsearchKey(e.target.value)}
                                />
                                <Button className="ms-2" variant='success'>Search</Button>
                            </Form>
                        </div>
                        {/* add btn */}
                        <div className="add">
                            <button onClick={addUser} className='btn btn-info' > <i className="fa-solid fa-user-plus fa-fade me-2"></i> Add </button>
                        </div>
                    </div>
                </div>
                <div className="sec_div mt-3 mb-3">
    
                    {
                        showSpin ? (
                            <div>
                                <LoadingSpinner />
                            </div> ): (
    
                            <div>
                                <h1>List Of Employees</h1>
                                <HomeTable displayData={allusers} handleDelete = {deleteUser} />
                            </div>
                    )}
    
                </div>
            </div>
        </>
    )
}

export default Home