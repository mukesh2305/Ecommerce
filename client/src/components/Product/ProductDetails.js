import React, { Fragment, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import "./PoductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productActions";
// useParams for fetching react js url paramater
import { useParams } from "react-router";
import ReactStars from "react-rating-stars-component";
import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";

const ProductDetails = () => {
	const { id } = useParams();
	const alert = useAlert();
	const dispatch = useDispatch();

	const { product, loading, error } = useSelector(
		(state) => state.productDetails
	);

	useEffect(() => {
		if (error) {
			// return alert.error(error);
			alert.error(error);
			dispatch(clearErrors());
		}
		dispatch(getProductDetails(id));
	}, [dispatch, id, error, alert]);


	const options = {
		edit: false,
		color: "rgba(20, 20, 20, 0.1)",
		activeColor: "tomato",
		size: window.innerWidth < 600 ? 18 : 23,
		value: product.ratings,
		isHalf: true,
	};

	return (
		<Fragment>
			{loading ? (
				<Loader />
			) : (
				<Fragment>
					<MetaData title={`${product.name} --- ECOMMERCE`} />
					<div className="ProductDetails">
						<div>
							<Carousel>
								{product.images &&
									product.images.map((item, i) => {
										return (
											<img
												className="CarouselImage"
												key={item.url}
												src={item.url}
												alt={`${i} Slide`}
											/>
										);
									})}
							</Carousel>
						</div>

						<div>
							<div className="detailsBlock-1">
								<h2>{product.name}</h2>
								<p>Product # {product._id}</p>
							</div>

							<div className="detailsBlock-2">
								<ReactStars {...options} />
								<span>({product.numberOfReviews}) Reviews</span>
							</div>

							<div className="detailsBlock-3">
								<h1>{`₹${product.price}`}</h1>

								<div className="detailsBlock-3-1">
									<div className="detailsBlock-3-1-1">
										<button>-</button>
										<input value="1" type="number" />
										<button>+</button>
									</div>

									<button>Add to Cart</button>
								</div>

								<p>
									Status:
									<b className={product.stock < 1 ? "redColor" : "greenColor"}>
										{product.stock < 1 ? "Out of Stock" : "In Stock"}
									</b>
								</p>
							</div>

							<div className="detailsBlock-4">
								Description : <p>{product.description}</p>
							</div>

							<button className="submitReview">Submit Review</button>
						</div>
					</div>
					<h3 className="reviewsHeading">REVIEWS</h3>

					{product.reviews && product.reviews[0] ? (
						<div className="reviews">
							{product.reviews &&
								product.reviews.map((review) => (
									<ReviewCard key={review._id} review={review} />
								))}
						</div>
					) : (
						<p className="noReviews">No Reviews yet </p>
					)}

				</Fragment>
			)}
		</Fragment>
	);
};

export default ProductDetails;
