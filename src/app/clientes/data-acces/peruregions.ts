export interface IProvincias {
    provincia: string;
    distritos: string[];
}

export interface Iregiones{

    departamento: string;
    provincias: IProvincias[];

}

export const PERU: Iregiones[] = [
    {
      departamento: 'Amazonas',
      provincias: [
        {
          provincia: 'Chachapoyas',
          distritos: ['Asunción', 'Balsas', 'Chachapoyas', 'Cheto', 'Chuquibamba', 'Granada', 'Huancas', 'La Jalca', 'Leimebamba', 'Levanto', 'Magdalena', 'Mariscal Castilla', 'Molinopampa', 'Montevideo', 'Olleros', 'Quinjalca', 'San Francisco de Daguas', 'San Isidro de Maino', 'Soloco', 'Sonche']
        },
        {
          provincia: 'Bagua',
          distritos: ['Aramango', 'Bagua', 'Copallín', 'El Parco', 'Imaza', 'La Peca']
        }
        // Agregar más provincias de Amazonas
      ]
    },
    {
      departamento: 'Áncash',
      provincias: [
        {
          provincia: 'Huaraz',
          distritos: ['Cochabamba', 'Colcabamba', 'Huanchay', 'Huaraz', 'Independencia', 'Jangas', 'La Libertad', 'Olleros', 'Pampas Grande', 'Pariacoto', 'Pira', 'Tarica']
        },
        {
          provincia: 'Aija',
          distritos: ['Aija', 'Coris', 'Huacllán', 'La Merced', 'Succha']
        }
        // Agregar más provincias de Áncash
      ]
    },
    {
      departamento: 'Apurímac',
      provincias: [
        {
          provincia: 'Abancay',
          distritos: ['Abancay', 'Chacoche', 'Circa', 'Curahuasi', 'Huanipaca', 'Lambrama', 'Pichirhua', 'San Pedro de Cachora', 'Tamburco']
        },
        {
          provincia: 'Andahuaylas',
          distritos: ['Andahuaylas', 'Andarapa', 'Chiara', 'Huancarama', 'Huancaray', 'Huayana', 'Kishuará', 'Pacobamba', 'Pacucha', 'Pampachiri', 'San Antonio de Cachi', 'San Jerónimo', 'San Miguel de Chaccrampa', 'Santa María de Chicmo', 'Talavera', 'Tumay Huaraca', 'Turpo']
        }
        // Agregar más provincias de Apurímac
      ]
    },
    {
      departamento: 'Arequipa',
      provincias: [
        {
          provincia: 'Arequipa',
          distritos: ['Alto Selva Alegre', 'Arequipa', 'Cayma', 'Cerro Colorado', 'Characato', 'Chiguata', 'Jacobo Hunter', 'José Luis Bustamante y Rivero', 'La Joya', 'Mariano Melgar', 'Miraflores', 'Mollebaya', 'Paucarpata', 'Pocsi', 'Polobaya', 'Quequeña', 'Sabandía', 'Sachaca', 'San Juan de Siguas', 'San Juan de Tarucani', 'Santa Isabel de Siguas', 'Santa Rita de Siguas', 'Socabaya', 'Tiabaya', 'Uchumayo', 'Vítor', 'Yanahuara', 'Yarabamba', 'Yura']
        },
        {
          provincia: 'Camana',
          distritos: ['Camaná', 'José María Quimper', 'Mariano Nicolás Valcárcel', 'Mariscal Cáceres', 'Nicolás de Piérola', 'Ocoña', 'Quilca', 'Samuel Pastor']
        }
        // Agregar más provincias de Arequipa
      ]
    },
    {
      departamento: 'Ayacucho',
      provincias: [
        {
          provincia: 'Huamanga',
          distritos: ['Acocro', 'Acos Vinchos', 'Andrés Avelino Cáceres Dorregaray', 'Ayacucho', 'Carmen Alto', 'Chiara', 'Jesús Nazareno', 'Ocros', 'Pacaycasa', 'Quinua', 'San José de Ticllas', 'San Juan Bautista', 'Santiago de Pischa', 'Socos', 'Tambillo', 'Vinchos']
        },
        {
          provincia: 'Cangallo',
          distritos: ['Cangallo', 'Chuschi', 'Los Morochucos', 'María Parado de Bellido', 'Paras', 'Totos']
        }
        // Agregar más provincias de Ayacucho
      ]
    },
    {
        departamento: 'Lima',
        provincias: [
          {
            provincia: 'Lima',
            distritos: [
              'Cercado de Lima', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 
              'Chorrillos', 'Cieneguilla', 'Comas', 'El Agustino', 'Independencia', 
              'Jesús María', 'La Molina', 'La Victoria', 'Lince', 'Los Olivos', 
              'Lurigancho', 'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacámac', 
              'Pucusana', 'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra', 
              'Rímac', 'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 
              'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel', 
              'Santa Anita', 'Santa María del Mar', 'Santa Rosa', 'Santiago de Surco', 
              'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo'
            ]
          },
          {
            provincia: 'Barranca',
            distritos: ['Barranca', 'Paramonga', 'Pativilca', 'Supe', 'Supe Puerto']
          },
          {
            provincia: 'Cajatambo',
            distritos: ['Cajatambo', 'Copa', 'Gorgor', 'Huancapón', 'Manás']
          },
          {
            provincia: 'Canta',
            distritos: ['Canta', 'Arahuay', 'Huamantanga', 'Huaros', 'Lachaqui', 'San Buenaventura', 'Santa Rosa de Quives']
          },
          {
            provincia: 'Cañete',
            distritos: [
              'San Vicente de Cañete', 'Asia', 'Calango', 'Cerro Azul', 'Chilca', 'Coayllo', 
              'Imperial', 'Lunahuaná', 'Mala', 'Nuevo Imperial', 'Pacarán', 'Quilmana', 
              'San Antonio', 'San Luis', 'Santa Cruz de Flores', 'Zúñiga'
            ]
          },
          {
            provincia: 'Huaral',
            distritos: ['Huaral', 'Atavillos Alto', 'Atavillos Bajo', 'Aucallama', 'Chancay', 'Ihuarí', 'Lampian', 'Pacaraos', 'San Miguel de Acos', 'Santa Cruz de Andamarca', 'Sumbilca', 'Veintisiete de Noviembre']
          },
          {
            provincia: 'Huarochirí',
            distritos: [
              'Matucana', 'Antioquía', 'Callahuanca', 'Carampoma', 'Chicla', 'Cuenca', 
              'Huachupampa', 'Huanza', 'Huarochirí', 'Lahuaytambo', 'Langa', 'Laraos', 
              'Mariatana', 'Ricardo Palma', 'San Andrés de Tupicocha', 'San Antonio', 
              'San Bartolomé', 'San Damián', 'San Juan de Iris', 'San Juan de Tantaranche', 
              'San Lorenzo de Quinti', 'San Mateo', 'San Mateo de Otao', 'San Pedro de Casta', 
              'San Pedro de Huancayre', 'Sangallaya', 'Santa Cruz de Cocachacra', 'Santa Eulalia', 
              'Santiago de Anchucaya', 'Santiago de Tuna', 'Santo Domingo de los Olleros', 
              'Surco'
            ]
          },
          {
            provincia: 'Huaura',
            distritos: ['Huacho', 'Ámbar', 'Caleta de Carquín', 'Checras', 'Hualmay', 'Huaura', 'Leoncio Prado', 'Paccho', 'Santa Leonor', 'Santa María', 'Sayán', 'Vegueta']
          },
          {
            provincia: 'Oyón',
            distritos: ['Oyón', 'Andajes', 'Caujul', 'Cochamarca', 'Naván', 'Pachangara']
          },
          {
            provincia: 'Yauyos',
            distritos: [
              'Yauyos', 'Alis', 'Ayauca', 'Ayaviri', 'Azángaro', 'Cacra', 'Carania', 'Catahuasi', 
              'Chocos', 'Cochas', 'Colonia', 'Hongos', 'Huampara', 'Huancaya', 'Huangáscar', 
              'Huantán', 'Huañec', 'Laraos', 'Lincha', 'Madean', 'Miraflores', 'Omas', 
              'Putinza', 'Quinches', 'Quinocay', 'San Joaquín', 'San Pedro de Pilas', 
              'Tanta', 'Tauripampa', 'Tomas', 'Tupe', 'Viñac', 'Vitis'
            ]
          }
        ]
      }
  ];
  