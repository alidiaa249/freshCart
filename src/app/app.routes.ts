import { Addresses } from './features/addresses/addresses';
import { Routes } from '@angular/router';
import { Homepage } from './features/main/homepage/homepage';
import { Categorypage } from './features/main/categorypage/categorypage';
import { Categorydetails } from './features/main/categorydetails/categorydetails';
import { Productspage } from './features/main/productspage/productspage';
import { Brands } from './features/main/brands/brands';
import { Searchpage } from './features/main/searchpage/searchpage';
import { Signup } from './features/main/signup/signup';
import { Signin } from './features/main/signin/signin';
import { Forgetpass } from './features/main/forgetpass/forgetpass';
import { Cartpage } from './features/main/cartpage/cartpage';
import { Wishlistpage } from './features/main/wishlistpage/wishlistpage';
import { Checkoutpage } from './features/main/checkoutpage/checkoutpage';
import { Profile } from './features/main/profile/profile';
import { Settings } from './features/settings/settings';
import { Allorders } from './features/main/allorders/allorders';
import { Contact } from './features/contact/contact';
import { Notfoundpage } from './features/notfoundpage/notfoundpage';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: Homepage, title: 'Homepage' },
  { path: 'categories', component: Categorypage, title: 'categories' },
  { path: 'category/:id', component: Categorydetails , title: 'Category Details' },
  { path: 'products', component: Productspage, title: 'Products' },
  {path: 'products/:id', loadComponent: () => import('./features/main/productsdetails/productsdetails').then(m => m.Productsdetails), title: 'Product Details' },
  {path:'brands' , component:Brands , title:'Brands'},
  {path:'search' , component:Searchpage , title:'Search'} ,
  {path:'signup' , component:Signup , title:'Register'} ,
  {path:'signin' , component:Signin , title:'Login'} ,
  {path:'forgetpassword' , component:Forgetpass , title:'Forget Password'} ,
  {path:'cart' , component:Cartpage , title:'cart'} ,
  {path:'wishlist' , component:Wishlistpage , title:'fav'} ,
  {path:'checkout' , component:Checkoutpage , title:'Checkout'} ,
  {path:'profile' , component:Profile , title:'Profile',children:[
    {path:"addresses" , component:Addresses, title:'Addresses'} ,
    {path:"settings" , component:Settings, title:'Settings'} ,
    
    {path:"" , redirectTo:"addresses" , title:'Addresses' , pathMatch:'full'} ,
    
  ] 

   

} ,


{path:"allorders" , component:Allorders , title: "Orders"},
{path:"contact" , component:Contact , title: "Contactc"},
{path:"**" , component:Notfoundpage , title: "Not Found"}

];