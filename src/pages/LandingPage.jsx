import { Button } from '@/components/ui/button';
import { Carousel, CarouselItem , CarouselContent} from '@/components/ui/carousel';
import React from 'react'
import { Link } from 'react-router-dom';
import companies from '../data/companies.json'
import Autoplay from "embla-carousel-autoplay"
import { Card , CardHeader , CardTitle , CardContent } from '@/components/ui/card';
import faqs from '../data/faq.json'
import { AccordionContent , AccordionItem , AccordionTrigger , Accordion } from '@/components/ui/accordion';


const LandingPage = () => {

console.log(faqs);


  return (
    <main className='flex flex-col gap-10 sm:gap-20 py-10 sm:py-20'>
  <section className='text-center'>

<h1 className="flex select-none text-gray-300 flex-col items-center text-4xl justify-center 
gradient-title font-extrabold tracking-tighter p-4 sm:text-6xl lg:text-8xl">Find Your Dream Job{" "}<span className='flex items-center
gap-2 sm:gap-6'>and Get{" "}
  <img src="./src/assets/logo.png" className='sm:h-24 lg:h-32 h-16' alt="Hirred Logo" /> </span></h1>
  

<p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
Explore thoussands of job listings or find the perfect candidate</p>

  </section>

<div className="flex gap-6 justify-center">

{/* button */}

<Link to='/jobs'>
<Button variant="blue" size='xl'>Find Jobs</Button>
</Link>


<Link to='/post-job'>
<Button variant='destructive' style={{backgroundColor:'#c10937'}} size='xl'>Post a Job</Button>
</Link>


</div>

{/* carousel  */}
<Carousel  className='w-full select-none py-10'
   plugins={[
    Autoplay({
      delay: 2000,
    }),
  ]}>
  <CarouselContent className='flex gap-5 items-center sm:gap-20'>
    {companies.map(({name,id,path}) => {

return ( <CarouselItem key={id} className='basis-1/3 lg:basis-1/6'>
  <img src={path} alt={name} className='h-9 sm:h-14 object-contain' />
</CarouselItem>
)

    })}
  </CarouselContent>

</Carousel>


{/* banner */}
{/* D:\WEB DEVELOPMENT PROJECT\React Big Projects\Job Portal\jp\src\assets\ai-boys.png */}
<img src="/src/assets/ai-boys.png" alt=""  className='w-full' />

<section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
{/* cards  */}
<Card>
  <CardHeader>
    <CardTitle>For Job Seekers</CardTitle>

  </CardHeader>
  <CardContent>
 Search and apply for Jobs , track applications , and more.
  </CardContent>

</Card>





<Card>
  <CardHeader>
    <CardTitle>For Employers</CardTitle>

  </CardHeader> 
  <CardContent>
Post Jobs, manage applications , and find the best candidates.
  </CardContent>

</Card>


</section>

{/* accordion */}
<section>

<Accordion  type="single" collapsible>
{faqs.map((faq,index)=>{

return (

<AccordionItem key={index} value={`item-${index+1}`}>
  <AccordionTrigger className={`text-xl cursor-pointer font-semibold text-gray-200`}>{faq.question}</AccordionTrigger>
  <AccordionContent className={`text-lg`}>
{faq.answer}
  </AccordionContent>
</AccordionItem>

)
})}

</Accordion>

</section>



    </main>
  )
}

export default LandingPage;
