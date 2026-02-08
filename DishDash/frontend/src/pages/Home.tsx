import styled from "styled-components";
import { NavLink } from "react-router-dom";
import homeContentData from "../data/homeContent.json";
import type { HomeContent } from "../types/home";

// Type-safe data extraction
const content = homeContentData as HomeContent;

const Container = styled.div`
	max-width: 800px;
	margin: 0 auto;
	padding: 48px 24px;
`;

const Header = styled.div`
	text-align: center;
	margin-bottom: 48px;
`;

const IconWrapper = styled.div`
	width: 80px;
	height: 80px;
	margin: 0 auto 24px;
	background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: var(--shadow-primary);
`;

const ChefIcon = styled.img`
	width: 48px;
	height: 48px;
	filter: brightness(0) invert(1);
`;

const Title = styled.h2`
	font-size: 2.5rem;
	font-weight: 700;
	color: var(--color-text-primary);
	margin: 0 0 16px 0;
	font-size: 1.75rem;
	font-weight: 700;
	color: var(--color-text-primary);
	margin: 0 0 32px 0;
`;

const Subtitle = styled.h2`
	font-size: 1.125rem;
	color: var(--color-text-light);
	line-height: 1.6;
	max-width: 600px;
	margin: 0 auto;
`;

const InfoSection = styled.div`
	background: var(--color-bg-lighter);
	border-radius: 16px;
	padding: 32px;
	margin-bottom: 48px;
`;

const SectionTitle = styled.h1`
	font-size: 1.5rem;
	font-weight: 600;
	color: var(--color-text-primary);
	margin: 0 0 16px 0;
	display: flex;
	align-items: center;
	gap: 8px;

	&::before {
		content: "✨";
		font-size: 1.25rem;
	}
`;

const Description = styled.p`
	font-size: 1rem;
	color: var(--color-text-cardtext);
	line-height: 1.7;
	margin: 0 0 16px 0;

	&:last-child {
		margin-bottom: 0;
	}
`;

const FeaturesSection = styled.div`
	margin-top: 48px;
`;

const FeaturesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 24px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

const FeatureCard = styled(NavLink)`
	background: white;
	border: 2px solid var(--color-border-focus);
	border-radius: 16px;
	padding: 28px;
	transition: all 0.3s ease;
	text-decoration: none;
	color: inherit;
	display: block;

	&:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-primary-hover);
		transform: translateY(-2px);
	}
`;

const FeatureIcon = styled.div<{ $color: string }>`
	width: 48px;
	height: 48px;
	background: ${(p) => p.$color};
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16px;
	font-size: 24px;

	img {
		width: 32px;
		height: 32px;
	}
`;

const FeatureTitle = styled.h3`
	font-size: 1.25rem;
	font-weight: 600;
	color: var(--color-text-primary);
	margin: 0 0 12px 0;
`;

const FeatureDescription = styled.p`
	font-size: 0.95rem;
	color: var(--color-text-light);
	line-height: 1.6;
	margin: 0;
`;

const HowItWorksSection = styled.div`
	margin-top: 64px;
	background: var(--color-bg-lighter);
	border-radius: 16px;
	padding: 40px;
`;

const StepsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

const StepItem = styled.div`
	display: flex;
	gap: 20px;
	align-items: flex-start;
`;

const StepNumber = styled.div`
	width: 40px;
	height: 40px;
	background: var(--color-primary);
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.125rem;
	font-weight: 700;
	flex-shrink: 0;
`;

const StepContent = styled.div`
	flex: 1;
`;

const StepTitle = styled.h3`
	font-size: 1.125rem;
	font-weight: 600;
	color: var(--color-text-primary);
	margin: 0 0 8px 0;
`;

const StepDescription = styled.p`
	font-size: 0.95rem;
	color: var(--color-text-light);
	line-height: 1.6;
	margin: 0;
`;

const BenefitsSection = styled.div`
	margin-top: 64px;
`;

const BenefitsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;

	@media (max-width: 640px) {
		grid-template-columns: 1fr;
	}
`;

const BenefitItem = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
`;

const CheckIcon = styled.div`
	width: 24px;
	height: 24px;
	background: var(--color-success);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-top: 2px;

	&::before {
		content: "✓";
		color: white;
		font-weight: 700;
		font-size: 14px;
	}
`;

const BenefitText = styled.p`
	font-size: 0.95rem;
	color: var(--color-text-cardtext);
	margin: 0;
	line-height: 1.6;
`;

const CallToActionSection = styled.div`
	margin-top: 64px;
	text-align: center;
	padding: 40px 24px;
`;

const CallToActionTitle = styled.h2`
	font-size: 1.5rem;
	font-weight: 600;
	color: var(--color-text-primary);
	margin: 0 0 12px 0;
`;

const CallToActionText = styled.p`
	font-size: 1rem;
	color: var(--color-primary);
	margin: 0;
	font-weight: 500;
`;

export function Home() {
	const featureRoutes: Record<number, string> = {
		1: "/ingredients",
		2: "/recipes",
		3: "/favorites",
		4: "/shopping-list",
	};

	return (
		<Container>
			<Header>
				<IconWrapper>
				<ChefIcon src={`${import.meta.env.BASE_URL}icons/big_hat.svg`} alt="DishDash" />
				</IconWrapper>
				<Subtitle>{content.hero.subtitle}</Subtitle>
			
			</Header>

			<InfoSection>
				<SectionTitle>{content.whatIsDishDash.title}</SectionTitle>
				{content.whatIsDishDash.paragraphs.map((paragraph, index) => (
					<Description key={index}>{paragraph}</Description>
				))}
			</InfoSection>

			<FeaturesSection>
				{/* <FeaturesSectionTitle>{content.featuresSection.title}</FeaturesSectionTitle> */}
				<Title>{content.featuresSection.title}</Title>
				<FeaturesGrid>
					{content.featuresSection.features.map((feature) => (
						<FeatureCard key={feature.id} to={featureRoutes[feature.id]}>
							<FeatureIcon $color={feature.color}>
								{feature.icon.endsWith('.svg') ? (
									<img src={`${import.meta.env.BASE_URL}${feature.icon.replace(/^\//, '')}`} alt={feature.title} />
								) : (
									feature.icon
								)}
							</FeatureIcon>
							<FeatureTitle>{feature.title}</FeatureTitle>
							<FeatureDescription>{feature.description}</FeatureDescription>
						</FeatureCard>
					))}
				</FeaturesGrid>
			</FeaturesSection>

			<HowItWorksSection>
				{/* <HowItWorksTitle>{content.howItWorksSection.title}</HowItWorksTitle> */}
				<Title>{content.howItWorksSection.title}</Title>
				<StepsList>
					{content.howItWorksSection.steps.map((step) => (
						<StepItem key={step.id}>
							<StepNumber>{step.stepNumber}</StepNumber>
							<StepContent>
								<StepTitle>{step.title}</StepTitle>
								<StepDescription>{step.description}</StepDescription>
							</StepContent>
						</StepItem>
					))}
				</StepsList>
			</HowItWorksSection>

			<BenefitsSection>
				{/* <BenefitsTitle>{content.benefitsSection.title}</BenefitsTitle> */}
				<Title>{content.benefitsSection.title}</Title>
				<BenefitsGrid>
					{content.benefitsSection.benefits.map((benefit) => (
						<BenefitItem key={benefit.id}>
							<CheckIcon />
							<BenefitText>{benefit.text}</BenefitText>
						</BenefitItem>
					))}
				</BenefitsGrid>
			</BenefitsSection>

			<CallToActionSection>
				<CallToActionTitle>{content.callToAction.title}</CallToActionTitle>
				<CallToActionText>{content.callToAction.text}</CallToActionText>
			</CallToActionSection>
		</Container>
	);
}
