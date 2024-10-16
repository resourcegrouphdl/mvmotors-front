export interface IMotos  {
    marca: string;
    modelo: IModelos[];
}

export interface IModelos{

    modelo: string;
    cilindrada: string;
    anio: string;
    precio: string;
    imagen: string;
    color: string[];

}

export const MOTOS: IMotos[] = [

    {
        marca : 'Yamaha',
        modelo : [
            {
                modelo: 'FZ',
                cilindrada: '150',
                anio: '2021',
                precio: 'S/. 8,000',
                imagen: 'https://www.yamaha-motor.com.pe/wp-content/uploads/2020/09/FZ-150-2021-1.jpg',
                color: ['Rojo', 'Azul']
            },
            
        ]
    },
    {
        marca : 'Honda',
        modelo : [
            {
                modelo: 'CB',
                cilindrada: '190',
                anio: '2021',
                precio: 'S/. 10,000',
                imagen: 'https://www.honda.com.pe/wp-content/uploads/2020/12/CB190R-2021-1.jpg',
                color: ['Rojo', 'Negro']
            },
            

        ]
    },
    {
        marca: "KTM",
        modelo: [
            {
                modelo: "DUKE",
                cilindrada: "200",
                anio: "2024",
                precio: "S/. 10,000",
                imagen: "",
                color: ["naranja", "negro"]
            },
            {
                modelo: "RC 390",
                cilindrada: "373",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["blanco", "naranja", "negro"]
            },
            {
                modelo: "890 Adventure",
                cilindrada: "889",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["naranja", "negro"]
            },
            {
                modelo: "450 EXC-F",
                cilindrada: "449",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["naranja", "blanco"]
            },
            {
                modelo: "690 Enduro R",
                cilindrada: "693",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["naranja", "blanco", "negro"]
            }
        ]
    },
    {
        marca: "Lifan",
            modelo: [
            {
                modelo: "KPR 200",
                cilindrada: "200",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["negro", "blanco", "rojo"]
            },
            {
                modelo: "LF 150-10S",
                cilindrada: "150",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["azul", "negro"]
            },
            {
                modelo: "LF 250GY-7",
                cilindrada: "250",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["rojo", "negro", "blanco"]
            },
            {
                modelo: "LF 150-13L",
                cilindrada: "150",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["negro", "gris"]
            },
            {
                modelo: "LF 200-3",
                cilindrada: "200",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["rojo", "blanco", "negro"]
            }
        ]
    },
    {
        marca: "Bruno",
        modelo: [
            {
                modelo: "Bruno CRX 200",
                cilindrada: "200",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["negro", "rojo"]
            },
            {
                modelo: "Bruno Cargo 150",
                cilindrada: "150",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["blanco", "negro"]
            },
            {
                modelo: "Bruno XR 250",
                cilindrada: "250",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["rojo", "negro", "azul"]
            },
            {
                modelo: "Bruno Urban 125",
                cilindrada: "125",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["negro", "gris"]
            },
            {
                modelo: "Bruno Super Sport 200",
                cilindrada: "200",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["negro", "azul", "rojo"]
            }
        ]
    },
    {
        marca: "Hero",
        modelo: [
            {
                modelo: "Hero Hunk 150R",
                cilindrada: "150",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["negro", "rojo", "azul"]
            },
            {
                modelo: "Hero Xpulse 200",
                cilindrada: "200",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["blanco", "negro", "verde"]
            },
            {
                modelo: "Hero Glamour 125",
                cilindrada: "125",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["rojo", "negro", "azul"]
            },
            {
                modelo: "Hero Splendor iSmart",
                cilindrada: "110",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["negro", "rojo", "azul"]
            },
            {
                modelo: "Hero Passion Pro",
                cilindrada: "110",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["rojo", "negro", "amarillo"]
            }
        ]
    },
    {
        marca: "Polux",
        modelo: [
            {
                modelo: "Polux RS 250",
                cilindrada: "250",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["negro", "rojo"]
            },
            {
                modelo: "Polux Urban 150",
                cilindrada: "150",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["negro", "blanco", "rojo"]
            },
            {
                modelo: "Polux Enduro 200",
                cilindrada: "200",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["naranja", "negro"]
            },
            {
                modelo: "Polux Cargo 150",
                cilindrada: "150",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["negro", "blanco"]
            },
            {
                modelo: "Polux Sport 200",
                cilindrada: "200",
                anio: "2024",
                precio: "",
                imagen: "",
                color: ["negro", "rojo", "azul"]
            }
        ]
    }

];