import React, {useState, useEffect, useContext} from 'react'
import Loading from '../../components/students/Loading'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const AllUsers = () => {
  const {backendUrl, getToken} = useContext(AppContext)
  const [allUsers, setAllUsers] = useState(null)
  const [isEducator, setIsEducator] = useState(false);



  // const fetchAllUsers = async () => {
  //   try {
  //     const {data} = await axios.get("http://localhost:5000/api/admin/all-users");
  //     setAllUsers(data.users);
  //   } catch (error) {
  //     console.log("Error fetching users:", error);
  //   }
  // };

  const fetchAllUsers = async () => {
    try {
     
      const {data} = await axios.get('http://localhost:5000/api/admin/all-users')
      

      data.success && setAllUsers(data.users);
      // console.log(users + data.success)

     
      
    } catch (error) {
      toast.error('here'+ error.message);
    }
  };


  // const fetchAllUsers =  async () => {
  //   try {
  //     const token = await getToken()
  //     const {data} = await axios.get(backendUrl + '/api/admin/all-users')

  //     if (data.success) {
  //       setAllUsers(data.users)
  //     console.log(allUsers[0]);
  //     }else {
  //       toast.error('from data'+ ' ' + data.message)
  //     }
      
  //   } catch (error) {
  //     toast.error(error.message)
  //   }
  // }

   useEffect(() => {
    
      // if (isEducator) {
        fetchAllUsers()
      // }
    }, [])


    return allUsers ?  (
      <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 ">
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className='table-fixed md:table-auto w-full overflow-hidden pb-4 '>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
                <th className='px-4 py-3 font-semibold '>user Name</th>
                <th className='px-4 py-3 font-semibold '>is Educator</th>
                <th className='px-4 py-3 font-semibold '>Date</th>
              </tr>
            </thead>
  
            <tbody className='text-sm text-gray-500'>
              {allUsers.map((item, index) => (
                <tr key={index} className='border-b border-gray-500/20'>
                  <td className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>{index + 1 }</td>
                  <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                    <img src={item.imageUrl} 
                    alt=""
                    className='w-9 h-9 rounded-full'
                    />
                    <span>{item.name}</span>
                  </td>
                  <td>
                  
                  </td>

                  <td className='px-4 py-3 hidden sm:table-cell'>{new Date(item.createdAt).toLocaleDateString()}</td>
                  {/* <td className='px-4 py-3 truncate '>{item.courseTitle}</td>
                  <td className='px-4 py-3 hidden sm:table-cell'>{new Date(item.purchaseDate).toLocaleDateString()}</td> */}
                </tr>
              )) }
            </tbody>
          </table>
        </div>
      </div>
    ) : <Loading />
  }

export default AllUsers
