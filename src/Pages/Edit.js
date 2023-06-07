import React,{useState,useEffect, useContext} from 'react'
import { Card, Form, Row,Button,Alert } from 'react-bootstrap'
import Select from 'react-select';
import LoadingSpinner from '../Components/LoadingSpinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { empRegister,updateUser,viewprofile } from '../services/allApis';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../services/base_url';
import { editContext } from '../Components/ContextShare';



function Edit() {

  //get edit context
  const {editdata,seteditdata} = useContext(editContext)

  //get parameter from url
  const {id} =  useParams()
  // state to hold existing image for server
  const [existingImg,setexistingImg] = useState("")

  //get details of given id from server
  const getUserProfile = async ()=>{
    //call viewprofile of service 
    const {data} = await viewprofile(id)
    setuserdata(data);
    setStatus(data.status)
    setexistingImg(data.profile)
  }


  //error msg
  const [errorMsg,setErrorMsg] = useState("")

  //use usenavigate hook
  const navigate = useNavigate()

  //create state to display spinner
  const [showSpin, setShowSpin] = useState(true)

  //status dropdown option
  const options = [
    { value: 'Active', label: 'Active' },
    { value: 'InActive', label: 'InActive' }
  ]

  //create state to hold userInputsdata
  const [userdata,setuserdata] = useState({
    fname:"",
    lname:"",
    email:"",
    mobile:"",
    gender:"",
    location:""
  })

  //create state for status
  const [status,setStatus] = useState("Active")

  //create state to hold image
  const [image,setImage] = useState("")

  //create state to hold profile picture
  const [preview,setPreview] = useState("")

  //to update userdata when user enter the input using html
  const userDetails = (e)=>{
    const {name,value} = e.target
    setuserdata({...userdata, [name]:value})
  }

  //to update status state
  const updateState = (e)=>{
    setStatus(e.value)
  }

  //update image state
  const setProfile = (e)=>{
    setImage(e.target.files[0])
  }

  // console.log(userdata);
  // console.log(status);
  // console.log(image);

  useEffect(()=>{
    getUserProfile()
  },[id])

  useEffect(()=>{

    if(image){
      setexistingImg("")
      //update preview picture
      setPreview(URL.createObjectURL(image))
    }

    //set showspin as false after 2 seconds
    setTimeout(() => {
        setShowSpin(false)
    }, 2000);
},[image])

  //defining register submission
  const handleSubmit = async (e)=>{
    //prevent click event to stop reload
    e.preventDefault()
    //get user input data from the form
    const {fname,lname,email,mobile,gender,location} = userdata
    if(fname===""){
      toast.error("First Name required!!!")
    }
    else if(lname===""){
      toast.error("Last Name required!!!")
    }else if(email===""){
      toast.error("Email required!!!")
    }else if(mobile===""){
      toast.error("Mobile Number required!!!")
    }else if(gender===""){
      toast.error("Gender required!!!")
    }else if(image===""){
      toast.error("Profile image required!!!")
    }else if(location===""){
      toast.error("Location required!!!")
    }else{
      //make edit api call

      //headerConfig
      const headerConfig = {
        "Content-Type":"multipart/form-data"
      }
      //body - formData
      const data = new FormData()
      data.append("user_profile",image || existingImg)
      data.append("fname",fname)
      data.append("lname",lname)
      data.append("email",email)
      data.append("mobile",mobile)
      data.append("gender",gender)
      data.append("status",status)
      data.append("location",location)
      //api call
      const response = await updateUser(id,data,headerConfig)
      if(response.status===200){
        //share response data to other component via context
        seteditdata(response.data)
        //navigate to home page
        navigate('/')
      }
      else{
        setErrorMsg("Error")
      }
    }
  }

  return (
    <>
    {
      errorMsg?<Alert variant='danger' className='bg-danger' onClose={()=>setErrorMsg("")} dismissible> {errorMsg} </Alert>:""
    }
      {
        showSpin? <LoadingSpinner/>:
        <div className="container mt-5">
        <h2 className='text-center mt-3'>Update Employee Details</h2>
        <Card className='shadow mt-3 p-3'>
          <div className="text-center mb-3">
            <img className='rounded-circle border p-1' width={'100px'} height={'100px'} src={preview?preview: `${BASE_URL}/uploads/${existingImg}`} alt="profile" />
          </div>
          <Form>
            <Row>
              {/* first name */}
              <Form.Group className='col-lg-6 mb-2'>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="First name"
                  name='fname'
                  value={userdata.fname}
                  onChange={userDetails}
                />
              </Form.Group>

              {/* last name */}
              <Form.Group className='col-lg-6 mb-2'>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Last name"
                  name='lname'
                  value={userdata.lname}
                  onChange={userDetails}
                />
              </Form.Group>

              {/* email */}
              <Form.Group className='col-lg-6 mb-2'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Email"
                  name='email'
                  value={userdata.email}
                  onChange={userDetails}
                />
              </Form.Group>

              {/* mobile */}
              <Form.Group className='col-lg-6 mb-2'>
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Mobile"
                  name='mobile'
                  value={userdata.mobile}
                  onChange={userDetails}
                />
              </Form.Group>

              {/* gender */}
              <Form.Group className='col-lg-6 mb-2'>
                <Form.Label>Gender</Form.Label>
                <Form.Check
                  type={'radio'}
                  label={'Male'}
                  name='gender'
                  value={"Male"}
                  checked={userdata.gender==="Male"?true:false}
                  onChange={userDetails}
                />
                <Form.Check
                  type={'radio'}
                  label={'Female'}
                  name='gender'
                  value={"Female"}
                  checked={userdata.gender==="Female"?true:false}
                  onChange={userDetails}
                />
              </Form.Group>

              {/* status */}
              <Form.Group className='col-lg-6 mb-2'>
                <Form.Label>Select Employee Status</Form.Label>
                <Select className='text-dark' options={options} defaultInputValue={status} onChange={updateState} />
              </Form.Group>

              {/* upload photo */}
              <Form.Group className='col-lg-6 mb-2'>
                <Form.Label>Choose Profile Picture</Form.Label>
                <Form.Control
                  name='user_profile'
                  required
                  type="file"
                  onChange={setProfile}
                />
              </Form.Group>

              {/* location */}
              <Form.Group className='col-lg-6 mb-2'>
                <Form.Label>Enter Employee Location</Form.Label>
                <Form.Control require type="text" placeholder="Employee Location"
                name='location' value={userdata.location} onChange={userDetails}
                />
              </Form.Group>

              {/* submit btn */}
              <Button onClick={handleSubmit} className='btn btn-info mt-3'>Submit</Button>
            </Row>
          </Form>
        </Card>
      </div>
      }
      <ToastContainer position='top-center'/>
    </>
  )
}

export default Edit