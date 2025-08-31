import { useState } from "react";
import styles from "./index.module.scss";

const KeyboardArrowDownIcon = ({ style = {} }) => (
    <svg
        style={{
            width: '24px',
            height: '24px',
            fill: 'currentColor',
            transition: 'transform 0.3s ease',
            ...style
        }}
        viewBox="0 0 24 24"
    >
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
);

const FAQSection = ({ faqData }) => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    if (!faqData || faqData.length === 0) {
        return null;
    }

    return (
        <div className={styles.faqSection}>
            <div className={styles.innerSection}>
                <h2>Frequently Asked Questions</h2>
                <div className={styles.faqContainer}>
                    {faqData.map((faq, index) => (
                        <div key={index} className={styles.faqItem}>
                            <div
                                className={styles.faqQuestion}
                                onClick={() => toggleFaq(index)}
                            >
                                <h3 className="font-[10] text-lg">{faq.question}</h3>
                                <span className={`${styles.faqArrow} ${openFaq === index ? styles.open : ''}`}>
                                    <KeyboardArrowDownIcon />
                                </span>
                            </div>
                            {openFaq === index && (
                                <div className={styles.faqAnswer}>
                                    <div
                                        className="px-4 text-black [&_a]:underline [&_a:hover]:no-underline"
                                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQSection;