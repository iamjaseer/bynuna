'use cleint'


import Images from "../../Components/Images";
import ForgetPassword from "../../Components/Forms/ForgetPassword";
import SectionHeader from "../../Components/SectionHeader";



export default function PasswordForgetPage() {
  return (
    <section className="pb-0 grid sm:gap-10 gap-6 sm:pt-20 pt-8">
      <div className="container container-fixed">
        <div className="max-w-lg mx-auto sm:border sm:border-border sm:px-[50px] px-[20px] sm:pt-[50px] sm:pb-[50px] grid gap-2">
          <SectionHeader
            title="Forgot Password"
            titleCenter
          />
          <ForgetPassword />
        </div>
      </div>
      <Images
        imageurl="/images/brand-bg.webp"
        quality="100"
        width="1500"
        height="300"
        alt="Login to bynuna"
        title="Login to bynuna"
        classes="block w-full mx-auto"
        placeholder={true}
      />
    </section>
  );
}
