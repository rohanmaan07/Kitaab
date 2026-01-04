function Footer() {
    return (
      <footer className="bg-black  text-white py-8 px-4 ">
        <div className="container mx-auto">
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Kitaab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  
