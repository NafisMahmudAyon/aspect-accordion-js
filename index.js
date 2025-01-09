import {
	Accordion,
	AccordionContent,
	AccordionHeader,
	AccordionItem,
} from "aspect-ui/Accordion";
import React from "react";
import ReactDOM from "react-dom";
import IconSelector from "./icons/IconSelector";
import './tailwind.js'

document.addEventListener("DOMContentLoaded", () => {
	const accordions = document.querySelectorAll(".aspect-accordion");

	accordions.forEach((container) => {
		try {
			const dataElement = container.querySelector(".aspect-accordion-data");
			if (!dataElement) return;

			const accordionID = dataElement.getAttribute("data-accordion-id");

			// Fetch accordion data
			fetch(
				`https://accordion-editor.nafisbd.com/api/accordion/fetch-data?id=${accordionID}`
			)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
					return response.json();
				})
				.then((data) => {
					const mainData = data.data[0];
					const accordionData = mainData?.content;
					const accordionTitle = mainData?.title;

					if (mainData.status === "publish") {
						// Render the Accordion component with fetched data
						ReactDOM.render(
							<Accordion
								activeItem={accordionData?.global?.activeItems?.map(
									(index) => `item-${index + 1}`
								)}
								iconEnabled={accordionData?.global?.iconEnabled ?? true}
								iconPosition={accordionData?.global?.iconPosition}
								className={accordionData?.global?.accordionClassName}
								multiple={accordionData?.global?.multiple ?? false}
								reset={true}>
								{accordionData.items.map((item, index) => (
									<AccordionItem
										key={index}
										id={`item-${index + 1}`}
										disabled={item?.disabled}>
										<AccordionHeader
											iconEnabled={item.iconEnabled}
											iconPosition={item.iconPosition}
											iconClassName={item.iconClassName}
											activeIconClassName={item.activeIconClassName}
											activeIcon={
												item.activeIcon ? (
													<IconSelector
														iconType={item.activeIconType}
														iconName={item.activeIcon}
													/>
												) : (
													<IconSelector
														iconType={accordionData?.global?.activeIconType}
														iconName={accordionData?.global?.activeIcon}
													/>
												)
											}
											inactiveIcon={
												item.inactiveIcon ? (
													<IconSelector
														iconType={item.inactiveIconType}
														iconName={item.inactiveIcon}
													/>
												) : (
													<IconSelector
														iconType={accordionData?.global?.inactiveIconType}
														iconName={accordionData?.global?.inactiveIcon}
													/>
												)
											}
											className={item.headerClassName}
											labelClassName={item.labelClassName}
											activeHeaderClassName={item.activeHeaderClassName}
											activeLabelClassName={item.activeLabelClassName}>
											{item.headerLabel}
										</AccordionHeader>
										<AccordionContent
											className={item.contentClassName}
											dangerouslySetInnerHTML={{ __html: item.content }}
										/>
									</AccordionItem>
								))}
							</Accordion>,
							container
						);
					}
					if (mainData.status !== "publish") {
						ReactDOM.render(
							<div>Please publish your accordion first</div>,
							container
						);
					}
				})
				.catch((error) => {
					console.error("Failed to fetch accordion data:", error);
				});
		} catch (error) {
			console.error("Accordion rendering failed:", error);
		}
	});
});
