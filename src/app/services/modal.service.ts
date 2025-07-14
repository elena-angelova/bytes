import { Injectable, Type } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ModalComponent } from "../ui/modal/modal";

@Injectable({
  providedIn: "root",
})
export class ModalService {}

// export class ModalService {
//   constructor(private dialog: MatDialog) {}

//   open(component: Type<any>, data?: any) {
//     // !Adjust the correct types and remove any
//     const dialogRef = this.dialog.open(ModalComponent);
//     dialogRef.componentInstance.open(component, data);
//   }
// }
