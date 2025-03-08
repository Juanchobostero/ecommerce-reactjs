import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";

const ComprarButton = () => {

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const toProducts = () => {
    window.location.href = "/catalogo";
  };

  return (
    <div className="d-flex justify-content-center mt-4">
       
      {/* <Button
        onClick={() => toProducts()}
        className="bg-amber-600 rounded-sm"
        style={{
          padding: "1rem 2rem",
          fontSize: "1rem",
        }}
      >
        COMPRAR
      </Button> */}
      <a 
        href={`${(userInfo && userInfo.name) ? '/catalogo' : 'https://wa.me/5493794921315'}`} 
        target={`${(userInfo && userInfo.name) ? '_self' : '_blank'}`} 
        rel={`${(userInfo && userInfo.name) ? '' : 'noopener noreferrer'}`}
        className="inline-flex items-center px-6 py-2 text-lg font-medium text-amber-100 bg-amber-700 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-amber-950 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-amber-700 dark:text-amber-100 dark:border-gray-600 dark:hover:text-white dark:hover:bg-amber-950 dark:focus:ring-amber-700"
      >
        COMPRAR 
        <svg className="w-4 h-4 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
      </a>

    </div>
  );
};

export default ComprarButton;
