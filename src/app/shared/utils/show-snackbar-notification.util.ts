import { ToastrService, ActiveToast } from "ngx-toastr";
import { ApiError } from "../../core/models/api-error.model";
import { NotificationCardComponent, NotificationCardData } from "../components/notification-card/notification-card.component";

type InputNotificationData =
  | { type: 'success' | 'info'; title: string; description?: string }
  | { type: 'error'; error: ApiError };

export function showSnackbar(
  toastr: ToastrService,
  data: InputNotificationData
): ActiveToast<any> {
  let cardData: NotificationCardData;
  if (data.type === 'error') {
    cardData = { type: 'error', error: data.error, title: data.error.message || 'Error' };
  } else {
    cardData = { type: data.type, title: data.title, description: data.description };
  }

  const toastrOptions = {
    toastComponent: NotificationCardComponent,
    disableTimeOut:false,
    tapToDismiss: false,
    closeButton: false,
    enableHtml: true,
    progressBar: true,
    timeOut: 5000,
    toastClass: 'app-custom-toast-container ngx-toastr',
  };

  const activeToast = toastr.show(
    undefined,
    undefined,
    toastrOptions
  );

  if (activeToast && activeToast.toastRef && activeToast.toastRef.componentInstance) {
    (activeToast.toastRef.componentInstance as NotificationCardComponent).notificationData = cardData;
  }

  return activeToast;
}
