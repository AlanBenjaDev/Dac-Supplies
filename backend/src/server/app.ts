import  express  from "express";
import usuariosRouter from "../routes/user.routes"
import productsRouter from "../routes/product.routes";
import cartRouter from "../routes/cart.routes";
import cors from "cors";
import { register } from "module";
import paymentRoutes from "../routes/payment.routes";
import { mercadopagoWebhook } from "../controllers/webhook.controller";
const app = express();


app.use(express.json())

app.use(cors());
const corsOptions = {
  origin: process.env.FRONTEND_URL || "",
  optionsSuccessStatus: 200 ,
    allowedHeaders: ["Content-Type", "Authorization"], // IMPORTANTE
  credentials: true


};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true })); // <-- ESTA LÍNEA ES VITAL

app.use((req, res, next) => {
  console.log("REQ PATH:", req.path, "METHOD:", req.method);
  next();
});



app.use("/user", usuariosRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/payments", paymentRoutes);
app.post(
  "/api/webhook/mercadopago",
  express.json(),
  mercadopagoWebhook
);


export default app
