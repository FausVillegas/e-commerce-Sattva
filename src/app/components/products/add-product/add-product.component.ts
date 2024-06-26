import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit{
  @ViewChild("formDirective") formDirective!: NgForm;
  // @Output() create: EventEmitter<any> = new EventEmitter;

  productForm: FormGroup;
  selectedImage: File | undefined;

  // isOpen = false;

  constructor(private authService: AuthService, private productService: ProductService) {
    this.productForm = this.createFormGroup();
  }

  ngOnInit(): void {
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required]),
      stock: new FormControl("", [Validators.required]),
      imageUrl: new FormControl(null, [Validators.required]),
      // id_supplier: new FormControl("", [Validators.required]),
    });
 }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }


//  onSubmit(formData: Pick<Product, "title" | "description" | "price" | "category" | "stock" | "imageUrl">): void {
//     if (this.productForm.valid) {
//       this.productService.createProduct(formData).pipe(first()).subscribe(() => {
//         this.create.emit(null);
//       })
//       console.log(formData);
//       console.log("selectedImage: "+this.selectedImage);
//       this.productForm.reset();
//       this.formDirective.resetForm();
//     } else {
//       console.log("The product form is not valid");
//     }
//  }

 onSubmit(): void {
  if (this.productForm.valid) {
    const formData = new FormData();
    formData.append('title', this.productForm.get('title')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('category', this.productForm.get('category')?.value);
    formData.append('stock', this.productForm.get('stock')?.value);
    formData.append('user', this.productForm.get('user')?.value);

    if (this.selectedImage) {
      formData.append('imageUrl', this.selectedImage);
    } else {
      console.error('No image file selected');
      return;
    }

    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        console.log('Product created successfully', response);
        this.productForm.reset();
        this.formDirective.resetForm();
      },
      error: (error) => {
        console.error('Error creating product', error);
      }
    });    
  } else {
    console.log("The product form is not valid");
  }
}
}
