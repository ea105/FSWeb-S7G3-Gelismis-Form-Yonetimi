import { useState, useEffect } from "react";
import axios from "axios";
import * as yup from 'yup';


const Form = (props) => {

	const initialForm = {
		fname: '',
		femail: '',
		fpass: '',
		fterms: false,
	}

	const [formData, setFormData] = useState(initialForm);
	const [formErrors, setFormErrors] = useState({});
	const [isDisabled, setIsDisabled] = useState(true);

	useEffect(() => {
		kontrolFonksiyonuButunForm(formData)
	}, [formData])

	const kontrolFonksiyonuAlanlar = (name, value) => {
		yup.reach(schema, name)
			.validate(value).then((valid) => {
				const newErrorState = {
					...formErrors,
					// computed property name
					// dynamic object keys
					[name]: ""
				}
				setFormErrors(newErrorState)
			})
			.catch(function (err) {
				err.errors; // => [{ key: 'field_too_short', values: { min: 18 } }]
				console.log("error:  ", err.name, err.errors[0])

				const newErrorState = {
					...formErrors,
					// computed property name
					// dynamic object keys
					[name]: err.errors[0]
				}
				setFormErrors(newErrorState)
			});
	}

	const kontrolFonksiyonuButunForm = (formVerileri) => {
		// console.log("formVerileri", formVerileri)
		schema
			.isValid(formVerileri)
			.then(function (valid) {
				console.log(valid, "valid")
				if (valid === true) {
					console.log("Axios ile sunucuya gönderilebilir buton aktif edilebilir")
					setIsDisabled(false)
				} else {

					setIsDisabled(true)
				}
			});
	}

	let schema = yup.object().shape({
		fname: yup.string().required("İsmini göremedim")
			.min(3, "Daha kısa bir isim olamaz mı? En az 3 karakter lütfen"),
		femail: yup.string()
			.email("Eposta adresinde bir hata olabilir mi bro/sis?")
			.required("Email lazımlı")
			.notOneOf(['waffle@syrup.com'], "Bu email adresi kullanılıyor"),
		fpass: yup.string().required("bir şifre olmalı mutlaka")
			.min(6, "Şifreniz en az 6 olmazsa kolay hacklenir")
			.matches(/[^0-9]/, "Şifre sadece sayı olamaz harf falan ekle"),
		fterms: yup.boolean().oneOf([true], "Kullanım koşullarını kabul etmelisiniz"),
	});


	const myChangeHandler = (event) => {
		// object destructuring
		const { name, value, type, checked } = event.target

		// console.log("changed", "target_name:", name, "target_value:", value, "target_type:", type, "target_checked:", checked)

		let newValue = type === "checkbox" ? checked : value

		const newState = {
			...formData,
			// computed property name
			// dynamic object keys
			[name]: newValue
		}

		setFormData(newState)
		// kontrolFonksiyonuButunForm(newState) // useEffect'e taşıdık
		kontrolFonksiyonuAlanlar(name, newValue)
	}

	const mySubmitHandler = (event) => {
		event.preventDefault()
		console.log("submitted", event)
		if (isDisabled === false) {
			axios.post('https://reqres.in/api/users', formData)
				.then(function (response) {
					console.log(response, "response")
					props.addUser(response.data)
				})
				.catch(function (error) {
					console.log(error, "error")
					alert("Gönderilemedi")
				});
		}
	}

	return <form onSubmit={mySubmitHandler}>
		<div>
			<label htmlFor="fname">İsim:</label>
			<input value={formData.fname}
				onChange={myChangeHandler}
				type="text"
				name="fname" />
			{formErrors.fname && <p className="error">{formErrors.fname}</p>}
		</div>
		<div>
			<label htmlFor="femail">Eposta:</label>
			<input value={formData.femail}
				onChange={myChangeHandler}
				type="email"
				name="femail" />
			{formErrors.femail && <p className="error">{formErrors.femail}</p>}
		</div>
		<div>
			<label htmlFor="fpass">Şifre:</label>
			<input value={formData.fpass}
				onChange={myChangeHandler}
				type="password"
				name="fpass" />
			{formErrors.fpass && <p className="error">{formErrors.fpass}</p>}
		</div>
		<div>
			<label htmlFor="fterms">Koşullar:</label>
			<input checked={formData.fterms}
				onChange={myChangeHandler}
				type="checkbox"
				name="fterms" />
			{formErrors.fterms && <p className="error">{formErrors.fterms}</p>}
		</div>
		<button disabled={isDisabled}
			type="submit">Gönder</button>

	</form>;
};

export default Form;
