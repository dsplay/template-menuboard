var dsplay_config = {
    // config parameters
    locale: 'pt_br',
    orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
    // Android SDK version
    osVersion: 19,
    // DSPLAY App version code
    appVersion: 99,
};

var dsplay_media = {
    duration: 60000,
    iteration: 5,
    result: {"version":"1.0.0","showOutdated":true,"validity":"2000-07-20 00:00:00","data":{"categories":[{"cod":1,"title":"Esfihas","priceTitles":["Preço"],"items":[{"num":"","title":"Esfiha de Carne","description":"","price1":"1,49"},{"num":"","title":"Esfiha de Frango","description":"","price1":"1,99"},{"num":"","title":"Esfiha de Queijo","description":"","price1":"1,99"},{"num":"","title":"Esfiha de Calabresa","description":"","price1":"1,99"},{"num":"","title":"Esfiha de Calabresa c/ Catupiry","description":"","price1":"2,50"},{"num":"","title":"Esfiha de Calabresa c/ Queijo","description":"","price1":"2,50"},{"num":"","title":"Esfiha de Quatro Queijos","description":"","price1":"2,50"},{"num":"","title":"Esfiha de Frango c/ Catupiry","description":"","price1":"2,50"},{"num":"","title":"","description":"","price1":""},{"num":"","title":"Esfiha de Charque","description":"","price1":"3,00"},{"num":"","title":"Esfiha Portuguesa","description":"","price1":"2,50"},{"num":"/fi(1, 12)","title":"","description":"","price1":""}]},{"cod":2,"title":"Salgados","priceTitles":["Preço"],"items":[{"num":"","title":"Mini Kibe de Requeijão","description":"","price1":"0,99"},{"num":"","title":"Kibe","description":"","price1":"3,50"},{"num":"","title":"Pastel de Carne","description":"","price1":"3,90"},{"num":"","title":"Pastel de Queijo","description":"","price1":"3,90"},{"num":"","title":"Pastel de Frango c/ Catupiry","description":"","price1":"3,90"},{"num":"","title":"Pastel de Calabresa","description":"","price1":"3,90"},{"num":"","title":"Pastel de Charque","description":"","price1":"4,90"},{"num":"/cb","title":"","description":"","price1":""},{"num":"","title":"","description":"","price1":""},{"num":"","title":"Batata Frita","description":"","price1":"4,90"},{"num":"","title":"Batata c/ Cheddar e Calabresa","description":"","price1":"6,90"},{"num":"/n","title":"","description":"","price1":""}]},{"cod":3,"title":"Sanduíches","priceTitles":["Preço"],"items":[{"num":"","title":"Beirute Frango c/ Catupiry","description":"","price1":"14,90"},{"num":"","title":"Beirute Calabresa","description":"","price1":"14,90"},{"num":"","title":"Beirute Peito de Peru","description":"","price1":"14,90"},{"num":"","title":"Hamburguer Simples","description":"","price1":"4,90"},{"num":"","title":"X-Salada","description":"","price1":"7,90"},{"num":"","title":"Double Cheddar","description":"","price1":"9,90"},{"num":"","title":"Dog","description":"","price1":"2,90"}]},{"cod":4,"title":"Pizzas","priceTitles":["Preço"],"items":[{"num":"","title":"Mussarela","description":"Molho de Tomate, Queijo Muçarela, Orégano, Tomate Fatiado, Azeitona","price1":"19,90"},{"num":"","title":"Calabresa","description":"Molho de Tomate, Queijo Muçarela, Calabresa Fatiada, Cebola, Orégano, Azeitona","price1":"19,90"},{"num":"","title":"Frango c/ Catupiry","description":"Molho de Tomate, Queijo Muçarela, Frango Temperado, Requeijão Catupiry, Orégano, Azeitona","price1":"23,90"},{"num":"","title":"Moda da Casa","description":"Molho de Tomate, Queijo Muçarela, Charque, Requeijão, Pimentão, Cebola, Orégano","price1":"27,90"},{"num":"","title":"Portuguesa","description":"Molho de Tomate, Queijo Muçarela, Presunto, Ovo Cozido, Ervilha, Cebola, Orégano, Azeitona","price1":"27,90"},{"num":"","title":"Atum","description":"Molho de Tomate, Queijo Muçarela, Atum, Cebola, Orégano, Azeitona","price1":"27,90"},{"num":"","title":"4 Queijos","description":"Molho de Tomate, Queijo Muçarela, Provolone, Gorgonzola, Requeijão Catupiry, Orégano, Azeitona","price1":"27,90"},{"num":"","title":"Mini Pizza","description":"Muçarela - Calabresa - Frango c/ Catupiry","price1":"9,90"},{"num":"","title":"Mini Pizza","description":"Charque - 4 Queijos - Atum","price1":"12,90"},{"num":"/fi(2,4)","title":"","description":"","price1":""}]},{"cod":5,"title":"Bebidas","priceTitles":["Preço"],"items":[{"num":"","title":"Sucos Naturais","description":"Limão - Acerola - Cajá - Manga - Abacaxi - Graviola - Maracujá - Goiaba","price1":"3,00"},{"num":"","title":"Suco Natural de Laranja","description":"","price1":"3,90"},{"num":"","title":"Milk Shake","description":"","price1":"4,90"},{"num":"","title":"Água Mineral","description":"","price1":"1,50"},{"num":"","title":"Refrigerante Lata","description":"","price1":"3,50"},{"num":"","title":"Refrigerante 1 Litro","description":"","price1":"5,90"},{"num":"","title":"Coca-Cola 1 Litro","description":"","price1":"5,90"},{"num":"","title":"","description":"","price1":""},{"num":"","title":"Refrigerante 2 Litros","description":"","price1":"8,90"},{"num":"","title":"Coca-Cola 2 Litros","description":"","price1":"9,90"},{"num":"","title":"Cerveja Lata","description":"","price1":"3,50"},{"num":"","title":"Cerveja Latão","description":"","price1":"4,50"},{"num":"","title":"Cerveja Long Neck","description":"","price1":"5,00"},{"num":"","title":"Caipirinha Pinga Limão","description":"","price1":"3,90"},{"num":"","title":"Caipirinha Pinga Maracujá","description":"","price1":"3,90"},{"num":"/fi(3, 8)","title":"","description":"","price1":""}]},{"cod":6,"title":"Sobremesas","priceTitles":["Preço"],"items":[{"num":"","title":"Banana Split","description":"","price1":"8,90"},{"num":"","title":"Sorvete 1 Bola","description":"","price1":"2,00"},{"num":"","title":"Sorvete 2 Bolas","description":"","price1":"3,00"},{"num":"/fi(4, 12)","title":"","description":"","price1":""},{"num":"/cb","title":"","description":"","price1":""},{"num":"/fi(5, 8)","title":"","description":"","price1":""}]},{"cod":7,"title":"Esfihas Doces","priceTitles":["Preço"],"items":[{"num":"","title":"Esfiha de Chocolate","description":"","price1":"3,50"},{"num":"","title":"Esfiha de Romeu e Julieta","description":"","price1":"3,50"},{"num":"","title":"Esfiha de Brigadeiro","description":"","price1":"3,50"},{"num":"","title":"Esfiha de Doce de Leite","description":"","price1":"3,50"}]}]}},
};

var dsplay_template = {
    debug: 'true',
    screenSize: 'small',
    logo: 'https://ui-avatars.com/api/?name=Esfiha&size=256&background=FFCA08&color=333333&bold=true&format=png',
    backgroundImage: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Caf%C3%A9_da_manh%C3%A3_brasileiro.jpg",
    currencySymbol: "R$",
    color1: '#FFCA08',
    color2: '#fff',
    color3: '#fff',
    color4: 'darkred',
    backgroundOpacity: .0000001,
    image1: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Sfiha2.jpg',
    image2: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg',
    image3: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Orange_juice_1_edit1.jpg',
    image4: 'https://upload.wikimedia.org/wikipedia/commons/6/69/%E2%80%9CAll_American%E2%80%9D_Banana_Split.jpg',
    image5: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Empanada_Gourmet.jpg',
    image6: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Picanha_%2814759358544%29.jpg',
    image7: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Grilled_plated_salmon_fillet.jpg',
    image8: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Glass_of_red_wine.jpg',
    image9: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Milk_Pitcher_With_Lid.jpg',
    footer: 'true',
};
